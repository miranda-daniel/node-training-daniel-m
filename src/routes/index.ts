import { Request, Response, Router } from 'express';

export const router = Router();

router.get('/', (_req: Request, res: Response) => res.send('OK'));
