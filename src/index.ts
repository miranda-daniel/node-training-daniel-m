import express from 'express';
import { router } from './routes';
import { RegisterRoutes } from '../build/routes';
import { ENV_VARIABLES } from './config/config';
import dotenv from 'dotenv';
import { postRoutesMiddleware, preRoutesMiddleware } from './middlewares/index-middlewares';

const app = express();
dotenv.config();

preRoutesMiddleware(app);

app.use('/', router);
// TSOA generated routes
RegisterRoutes(app);

postRoutesMiddleware(app);

app.listen(ENV_VARIABLES.port, () => {
  console.log('Listening on port', ENV_VARIABLES.port);
});
