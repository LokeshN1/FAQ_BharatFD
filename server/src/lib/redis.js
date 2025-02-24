import { createClient } from 'redis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL
});

// Event listeners for connection status
redisClient.on('error', err => console.error('❌ Redis Client Error:', err));
redisClient.on('connect', () => console.log('✅ Connected to Redis Cloud'));

// Connect to Redis
const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('❌ Failed to connect to Redis:', err);
    }
};

// Graceful shutdown for Redis
process.on('SIGINT', async () => {
    console.log('Closing Redis connection...');
    await redisClient.quit();
    process.exit(0);
});

// Connect Redis when the app starts
connectRedis();

export { redisClient };
