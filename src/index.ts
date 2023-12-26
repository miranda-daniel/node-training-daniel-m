import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes';
import { RegisterRoutes } from '../build/routes';
import dotenv from 'dotenv';
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use('/', router);
RegisterRoutes(app);

dotenv.config();

app.listen(3001, () => {
  console.log('Listening on port', 3001);
});
