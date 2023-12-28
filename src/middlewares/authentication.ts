/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import jwt from 'jsonwebtoken';

export function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<any> {
  const jsonSignature = process.env.JSON_SIGNATURE!;

  if (securityName === 'jwt') {
    const token = request.headers.authorization!;

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('unauthenticated!'));
      }
      jwt.verify(token, jsonSignature, (err: any, decoded: any) => {
        if (err) {
          if (err instanceof jwt.TokenExpiredError) {
            reject(new Error('EXPIRED_TOKEN'));
          } else {
            reject(new Error('INVALID_TOKEN'));
          }
        }
        resolve({
          ...decoded.user,
          token,
        });
      });
    });
  }
  return Promise.resolve(null);
}
