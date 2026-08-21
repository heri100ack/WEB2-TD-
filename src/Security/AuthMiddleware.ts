import { RequestHandler } from 'express';
import { verifyAccessToken } from './jwt';
import { AuthentificationCompte, Role } from '../model/Compte';

const BEARER_PREFIX = 'Bearer ';

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthentificationCompte;
    }
  }
}

export const authenticate: RequestHandler = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith(BEARER_PREFIX)) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }
  try {
    req.authUser = verifyAccessToken(authorization.slice(BEARER_PREFIX.length));
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize =
  (...roles: Role[]): RequestHandler =>
  (req, res, next) => {
    if (!req.authUser || !roles.includes(req.authUser.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
