import { createClient } from 'redis';

// Replace with your actual Redis URL
const redisUrl: string = process.env.REDIS_URI ?? 'redis://localhost:6379';

export const redisClient = createClient({
  url: redisUrl.toString(),
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected successfully');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();
