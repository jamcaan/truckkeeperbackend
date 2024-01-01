import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface ExtendedRequest extends Request {
    user: {
      id: string;
      email: string;
      role: string;
      first_name: string;
    };
  }

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: ExtendedRequest, res: Response, next: NextFunction) {
    // Extract the token from the request headers
    const token = req.headers.authorization?.split(' ')[1];

    // Verify the token's signature and integrity using the secret key
    try {
      const secretKey = process.env.JSON_TOKEN_KEY;
      const decodedToken = jwt.verify(token, secretKey) as { [key: string]: any };

      // Check the token's expiration time and other relevant claims to ensure its validity
      if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
        throw new Error('Token has expired');
      }

      // Attach the authenticated user's information to the request object
      req.user = {
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role,
        first_name: decodedToken.first_name,
      };

      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}
