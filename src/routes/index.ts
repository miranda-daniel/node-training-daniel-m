import { Request, Response, Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../build/swagger.json';

export const router = Router();

router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument));

router.get('/', (_req: Request, res: Response) => res.send('OK'));