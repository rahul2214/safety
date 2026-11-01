/**
 * High-performance In-Memory and Stale-While-Revalidate (SWR) Cache
 * for Sabhijude Frontend.
 *
 * Provides:
 * - Instant sub-millisecond retrieval of cached endpoints.
 * - Stale-while-revalidate background refresh.
 * - Granular TTL per endpoint category (Lookups: 10m, Feeds: 30s, Profile/Stats: 1m).
 * - Automatic targeted cache invalidation on mutations (POST, PUT, DELETE, PATCH).
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
  etag?: string;
}

class ApiCache {
  private store = new Map<string, CacheEntry<any>>();

  // Default TTL rules based on URL patterns
  private getTtlForUrl(url: string, customTtl?: number): number {
    if (customTtl !== undefined && customTtl >= 0) return customTtl;

    // Static lookup data that rarely changes (10 minutes)
    if (
      url.includes('/categories') ||
      url.includes('/postseverities') ||
      url.includes('/poststatuses') ||
      url.includes('/postvisibilities') ||
      url.includes('/genders') ||
      url.includes('/occupationstatuses') ||
      url.includes('/relationships')
    ) {
      return 10 * 60 * 1000;
    }

    // Safety places and map anchors (1 hour)
    if (url.includes('/safety-places')) {
      return 60 * 60 * 1000;
    }

    // Topics (5 minutes)
    if (url.includes('/topics')) {
      return 5 * 60 * 1000;
    }

    // User profile and stats (60 seconds)
    if (url.includes('/users/me') || url.includes('/stats')) {
      return 60 * 1000;
    }

    // Emergency contacts (2 minutes)
    if (url.includes('/emergencycontacts')) {
      return 2 * 60 * 1000;
    }

    // Dynamic feed and search (30 seconds SWR)
    if (url.includes('/posts') || url.includes('/search') || url.includes('/discover')) {
      return 30 * 1000;
    }

    // Default general GET cache (15 seconds)
    return 15 * 1000;
  }

  /**
   * Get cached entry if valid (within TTL).
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age <= entry.ttlMs) {
      return entry.data as T;
    }

    // If completely expired past 2x TTL, delete entry
    if (age > entry.ttlMs * 2) {
      this.store.delete(key);
      return null;
    }

    return null;
  }

  /**
   * Stale-While-Revalidate access:
   * Returns data if available (even if stale) along with stale flag.
   */
  getWithStale<T>(key: string): { data: T | null; isStale: boolean } {
    const entry = this.store.get(key);
    if (!entry) return { data: null, isStale: false };

    const age = Date.now() - entry.timestamp;
    const isStale = age > entry.ttlMs;

    // Hard cutoff: don't serve data older than 10 minutes past expiry
    if (age > entry.ttlMs + 10 * 60 * 1000) {
      this.store.delete(key);
      return { data: null, isStale: false };
    }

    return { data: entry.data as T, isStale };
  }

  /**
   * Store data in cache with auto-computed or custom TTL.
   */
  set<T>(key: string, data: T, customTtl?: number, etag?: string): void {
    const ttlMs = this.getTtlForUrl(key, customTtl);
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttlMs,
      etag,
    });
  }

  /**
   * Invalidate a single key, regex pattern, or endpoint prefix.
   */
  invalidate(pattern?: string | RegExp): void {
    if (!pattern) {
      this.store.clear();
      return;
    }

    if (typeof pattern === 'string') {
      const lower = pattern.toLowerCase();
      for (const key of this.store.keys()) {
        if (key.toLowerCase().includes(lower)) {
          this.store.delete(key);
        }
      }
    } else {
      for (const key of this.store.keys()) {
        if (pattern.test(key)) {
          this.store.delete(key);
        }
      }
    }
  }

  /**
   * Invalidate related cache tags after mutations.
   */
  invalidateOnMutation(method: string, endpoint: string): void {
    const m = method.toUpperCase();
    if (m === 'GET' || m === 'HEAD') return;

    const lower = endpoint.toLowerCase();

    // Post creation, edit, vote, or comment
    if (lower.includes('/posts') || lower.includes('/post')) {
      this.invalidate('/posts');
      this.invalidate('/search');
      this.invalidate('/discover');
      this.invalidate('/users/me/stats');
    }

    // Emergency contacts mutation
    if (lower.includes('/emergencycontacts') || lower.includes('/contacts')) {
      this.invalidate('/emergencycontacts');
    }

    // Profile mutation
    if (lower.includes('/profile') || lower.includes('/users/me')) {
      this.invalidate('/users/me');
      this.invalidate('/auth/profile');
    }

    // Support ticket mutation
    if (lower.includes('/supporttickets') || lower.includes('/support')) {
      this.invalidate('/support');
    }

    // Notification mutation
    if (lower.includes('/notifications')) {
      this.invalidate('/notifications');
    }

    // Admin / Org mutations
    if (lower.includes('/admin')) {
      this.invalidate('/admin');
    }
    if (lower.includes('/org')) {
      this.invalidate('/org');
    }
  }

  /**
   * Clear all cache.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Debug info: total cached items.
   */
  size(): number {
    return this.store.size;
  }
}

// Global singleton instance
export const apiCache = new ApiCache();
