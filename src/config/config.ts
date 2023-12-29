import { z } from 'zod';
import { EnvVariables } from '../types/envVariables';

const envVariablesSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  JSON_SIGNATURE: z.string(),
})
.passthrough();

const envVars = envVariablesSchema.parse(process.env);

export const ENV_VARIABLES: EnvVariables = {
  port: envVars.PORT,
  dataBaseURL: envVars.DATABASE_URL,
  jsonSignature: envVars.JSON_SIGNATURE,
};
