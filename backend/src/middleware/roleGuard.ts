import { Request, Response, NextFunction } from 'express';

// Map legacy role names to new roles and vice versa
const ROLE_EQUIVALENTS: Record<string, string[]> = {
  DEPARTMENT_USER: ['DEPARTMENT_USER', 'CITIZEN'],
  CITIZEN: ['DEPARTMENT_USER', 'CITIZEN'],
  STARTUP: ['STARTUP', 'UNIVERSITY', 'INDUSTRY'],
  UNIVERSITY: ['STARTUP', 'UNIVERSITY'],
  INDUSTRY: ['STARTUP', 'INDUSTRY'],
  INNOVATION_SOCIETY_ADMIN: ['INNOVATION_SOCIETY_ADMIN', 'ADMIN'],
  ADMIN: ['INNOVATION_SOCIETY_ADMIN', 'ADMIN'],
  EVALUATOR: ['EVALUATOR'],
  VALIDATOR: ['VALIDATOR'],
};

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const userRole = req.user.role;
    const allowed = roles.some((requiredRole) => {
      const equivalents = ROLE_EQUIVALENTS[requiredRole] || [requiredRole];
      return equivalents.includes(userRole);
    });

    if (!allowed) {
      res.status(403).json({ error: 'Insufficient permissions for this operation' });
      return;
    }
    next();
  };
}
