/**
 * Web Audio API synthesized audio utilities:
 * Incoming phone call ringtone generator for fake call simulation
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isRinging = false;
  private ringInterval: any = null;

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Start phone ringtone for fake call.
   */
  public startRingtone(): void {
    if (typeof window === 'undefined') return;
    if (this.isRinging) return;

    try {
      const ctx = this.getContext();
      this.isRinging = true;

      const playRingBurst = () => {
        if (!this.isRinging) return;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, ctx.currentTime);
        osc2.frequency.setValueAtTime(480, ctx.currentTime);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.8);
        osc2.stop(ctx.currentTime + 1.8);
      };

      playRingBurst();
      this.ringInterval = setInterval(() => {
        playRingBurst();
      }, 3000);
    } catch (e) {
      console.warn('Ringtone playback error:', e);
    }
  }

  /**
   * Stop ringtone.
   */
  public stopRingtone(): void {
    this.isRinging = false;
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }
}

export const soundEngine = new SoundController();
