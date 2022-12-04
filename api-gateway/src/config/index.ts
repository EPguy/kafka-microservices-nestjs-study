import { config } from 'dotenv';
config({ path: `../.env.${process.env.NODE_ENV || 'development'}.local` });

export const { KAFKA_BROKER_PORT, API_GATEWAY_PORT } = process.env;
