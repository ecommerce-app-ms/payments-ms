import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  //PRODUCTS_MICROSERVICES_HOST: string;
  // PRODUCTS_MICROSERVICES_PORT: number;
  // ORDERS_MICROSERVICES_HOST: string;
  // ORDERS_MICROSERVICES_PORT: number;
  // NAST_SERVERS: string[];
  STRIPE_API_KEY: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
  STRIPE_ENDPOINT_SECRET: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    STRIPE_API_KEY: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
    STRIPE_ENDPOINT_SECRET: joi.string().required(),
    //PRODUCTS_MICROSERVICES_HOST: joi.string().required(),
    //PRODUCTS_MICROSERVICES_PORT: joi.number().required(),
    //ORDERS_MICROSERVICES_HOST: joi.string().required(),
    //ORDERS_MICROSERVICES_PORT: joi.string().required(),

    // NAST_SERVERS: joi.array().items(joi.string().required()).required(),
  })
  .unknown(true);
const { error, value } = envSchema.validate({
  ...process.env,
  NAST_SERVERS: process.env.NAST_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  stripe_api_key: envVars.STRIPE_API_KEY,
  stripe_success_url: envVars.STRIPE_SUCCESS_URL,
  stripe_cancel_urL: envVars.STRIPE_CANCEL_URL,
  stripe_endpoint_secret: envVars.STRIPE_ENDPOINT_SECRET,
  //products_microservices_host: envVars.PRODUCTS_MICROSERVICES_HOST,
  //products_microservices_port: envVars.PRODUCTS_MICROSERVICES_PORT,
  //orders_microservices_host: envVars.ORDERS_MICROSERVICES_HOST,
  //orders_microservices_port: envVars.ORDERS_MICROSERVICES_PORT,
  // nast_servers: envVars.NAST_SERVERS,
};
