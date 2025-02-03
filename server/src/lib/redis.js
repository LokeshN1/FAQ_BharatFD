import redis from "redis";

//  Configure Redis
const redisClient = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: process.env.REDIS_PORT || 6379,
    },
  });
  
  redisClient
    .connect()
    .then(() => console.log("Redis Connected"))
    .catch((err) => console.error("Redis Connection Failed:", err.message));
  
  // ✅ Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Closing Redis connection...");
    await redisClient.quit();
    process.exit(0);
  });

// Export Redis client for reuse
  export {redisClient};