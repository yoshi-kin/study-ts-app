import config from "@/lib/config";
import { Redis } from "@upstash/redis";

const {
  env: {
    redis: { upstashRedisUrl, upstashRedisToken },
  },
} = config;

export const redis = new Redis({
  url: upstashRedisUrl,
  token: upstashRedisToken,
});
