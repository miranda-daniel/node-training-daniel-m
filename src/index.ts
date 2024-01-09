import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes';
import { RegisterRoutes } from '../build/routes';
import { ENV_VARIABLES } from './config/config';
import dotenv from 'dotenv';
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use('/', router);
RegisterRoutes(app);

dotenv.config();

app.listen(ENV_VARIABLES.port, () => {
  console.log('Listening on port', ENV_VARIABLES.port);
});
