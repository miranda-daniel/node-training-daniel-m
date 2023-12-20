import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes';
import { RegisterRoutes } from '../build/routes';
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use('/', router);
RegisterRoutes(app);

app.listen(3000, () => {
  console.log('Listening on port', 3000);
});
