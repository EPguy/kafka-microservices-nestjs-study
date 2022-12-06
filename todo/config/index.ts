import { config } from 'dotenv';
config({ path: `../.env.${process.env.NODE_ENV || 'development'}.local` });

export const { KAFKA_BROKER_PORT, DB_HOST, DB_PORT, DB_DATABASE } = process.env;
