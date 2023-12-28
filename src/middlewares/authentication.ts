/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../config/apiError';
import { errors } from '../config/errors';

export function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<any> {
  const jsonSignature = process.env.JSON_SIGNATURE!;

  if (securityName === 'jwt') {
    const token = request.headers.authorization!;

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new ApiError(errors.UNAUTHENTICATED));
      }
      jwt.verify(token, jsonSignature, (err: any, decoded: any) => {
        if (err) {
          if (err instanceof jwt.TokenExpiredError) {
            reject(new ApiError(errors.EXPIRED_TOKEN));
          } else {
            reject(new ApiError(errors.INVALID_TOKEN));
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
