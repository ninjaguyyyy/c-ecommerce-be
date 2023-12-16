import { API_PREFIX } from "shared/constants/global.constants";

export const GLOBAL_CONFIG = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: "Nestjs Prisma Starter",
    description: "The nestjs API description",
    version: "1.5",
    path: API_PREFIX,
  },
  security: {
    expiresIn: 3600 * 24, // 24h
    bcryptSaltOrRound: 10,
  },
  logger: {
    folder_path: process.env.LOG_FOLDER_PATH,
    level: process.env.LOG_LEVEL,
  },
  external: {
    frontend_url: process.env.FRONTEND_URL,
  },
  email: {
    from_email: process.env.EMAIL_FROM,
    server: {
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      pool: true,
      maxConnections: 5,
    },
  },
  prisma: {
    log_levels: process.env.PRISMA_LOG_LEVELS ? process.env.PRISMA_LOG_LEVELS.split(",") : [],
  },
  aws: {
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    s3: {
      bucket: process.env.AWS_S3_BUCKET
    },
    region: process.env.AWS_REGION
  }

};
