import { url } from "inspector";

const config = {
  env: {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
    imagekit: {
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    },
    databaseurl: process.env.DATABASE_URL!,
    redis: {
      upstashRedisUrl: process.env.UPSTASH_REDIS_REST_URL!,
      upstashRedisToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
    },

    qstash: {
      qstashUrl: process.env.QSTASH_URL!,
      qstashToken: process.env.QSTASH_TOKEN!,
    },

    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },

    resend: {
      token: process.env.RESEND_TOKEN!,
    },
  },
};

export default config;
