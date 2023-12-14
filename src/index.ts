import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { usersRouter } from './routes/users.routes';

const app = express();

const paths = {
  users: "/api/users",
};

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(paths.users, usersRouter);

app.listen(3000, () => {
  console.log('Listening on port', 3000);
});
