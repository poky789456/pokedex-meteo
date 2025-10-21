import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export interface ICache {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
}

export class RedisCache implements ICache {
  constructor(private client = redisClient) {}
  async get(key: string) {
    return this.client.get(key);
  }
  async set(key: string, value: string, ttlSeconds = Number(process.env.CACHE_TTL_SECONDS || 600)) {
    await this.client.set(key, value, { EX: ttlSeconds });
  }
}

export class MemoryCache implements ICache {
  private store = new Map<string, { value: string; exp?: number }>();
  async get(key: string) {
    const e = this.store.get(key);
    if (!e) return null;
    if (e.exp && Date.now() > e.exp) { this.store.delete(key); return null; }
    return e.value;
  }
  async set(key: string, value: string, ttlSeconds = 600) {
    const exp = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, exp });
  }
}
