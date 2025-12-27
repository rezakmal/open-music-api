const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER || 'localhost',
      },
    });

    this._client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });

    this._client.connect().catch(console.error);
  }

  async set(key, value, expirationInSeconds = 1800) {
    if (!this._client.isOpen) return;
    try {
      await this._client.set(key, value, {
        EX: expirationInSeconds,
      });
    } catch (error) {
      console.error('Cache set failed:', error.message);
    }
  }

  async get(key) {
    if (!this._client.isOpen) throw new Error('Cache tidak aktif');
    try {
      const result = await this._client.get(key);
      if (result === null) throw new Error('Cache tidak ditemukan');
      return result;
    } catch (error) {
      throw error;
    }
  }

  async delete(key) {
    if (!this._client.isOpen) return;
    try {
      return await this._client.del(key);
    } catch (error) {
      console.error('Cache delete failed:', error.message);
    }
  }
}

module.exports = CacheService;
