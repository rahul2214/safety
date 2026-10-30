import * as signalR from '@microsoft/signalr';
import { getToken } from './session';

export type SosAlertEvent = {
  incidentId: number;
  organizationId: number;
  organizationName: string;
  userId: number;
  userName: string;
  userPhone: string;
  memberType?: string;
  memberCode?: string;
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
  severity: string;
  status: string;
  createdAt: string;
};

export type SafetyHubHandlers = {
  onSosAlert?: (alert: SosAlertEvent) => void;
  onIncidentChanged?: (incident: unknown) => void;
  /** Called when the server refuses the subscription, e.g. this account lacks responder access. */
  onAccessDenied?: (message: string) => void;
};

/**
 * Live connection to the organization's safety hub.
 *
 * The hub now authorizes every group subscription, so the connection must carry the
 * signed-in session token. A browser cannot set headers on a WebSocket handshake, so the
 * SignalR client appends the token as a query parameter and the API promotes it back to an
 * Authorization header.
 */
export class SafetyHubClient {
  private connection: signalR.HubConnection | null = null;
  private orgId: number;
  private handlers: SafetyHubHandlers;

  constructor(orgId: number, handlers: SafetyHubHandlers | ((alert: SosAlertEvent) => void) = {}) {
    this.orgId = orgId;
    // Accepts a bare callback so existing call sites that pass one keep working.
    this.handlers = typeof handlers === 'function' ? { onSosAlert: handlers } : handlers;
  }

  public async start() {
    const defaultProdUrl = 'https://safecircle-api-752721321209.asia-south1.run.app';
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === 'production' ? defaultProdUrl : 'http://localhost:5000');

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${backendUrl}/hubs/safety`, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
        // Read at connect time and on every reconnect, so a refreshed session is picked up.
        accessTokenFactory: () => getToken() ?? '',
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .build();

    this.connection.on('SosTriggered', (alert: SosAlertEvent) => {
      this.handlers.onSosAlert?.(alert);
    });

    this.connection.on('IncidentStatusChanged', (incident: unknown) => {
      this.handlers.onIncidentChanged?.(incident);
    });

    this.connection.on('IncidentAssigned', (incident: unknown) => {
      this.handlers.onIncidentChanged?.(incident);
    });

    // Re-join after a reconnect; group membership does not survive a dropped connection.
    this.connection.onreconnected(() => {
      void this.joinGroups();
    });

    try {
      await this.connection.start();
      await this.joinGroups();
    } catch (err) {
      console.warn('SafetyHub connection failed; it will retry automatically.', err);
    }
  }

  private async joinGroups() {
    if (!this.connection) return;

    try {
      await this.connection.invoke('JoinSecurityGroup', this.orgId);
    } catch (err) {
      // The hub throws when the account is not a responder for this organization. That is
      // an authorization outcome, not a transport failure, so surface it to the operator.
      const message =
        err instanceof Error ? err.message : 'Could not subscribe to live safety alerts.';
      console.warn('SafetyHub subscription refused:', message);
      this.handlers.onAccessDenied?.(message);
    }
  }

  public async stop() {
    if (!this.connection) return;

    try {
      await this.connection.invoke('LeaveOrganization', this.orgId);
    } catch {
      // Connection may already be closing; nothing useful to do.
    }

    await this.connection.stop();
    this.connection = null;
  }
}
