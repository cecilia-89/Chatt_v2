import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient({
        url: process.env.REDIS_URI
    });
    this.client.connect();
    this.client.on('connect', () => {
      console.log('Redis connection established');
    });
    this.client.on('error', (err) => {
      console.log('Redis client error:', err);
    });
  }

  async get(key) {
    const value = await this.client.get(key);
    return value;
  }

  async set(key, value, duration) {
    await this.client.set(key, value);
    await this.client.expire(key, duration);
  }
}

const redisClient = new RedisClient();
export default redisClient;