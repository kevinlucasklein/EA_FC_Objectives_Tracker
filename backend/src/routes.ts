import { Router } from 'express';
import { register, login, validateToken } from './controllers/authController';
import { createObjective, getObjectives } from './controllers/objectiveController';
import { isAdmin, isAuthenticated } from './middleware/authMiddleware';
import { setUser } from './middleware/setUser';

export const router = Router();

router.post('/api/register', register);
router.post('/api/login', login);

// Use setUser middleware for routes that require authentication
router.use(setUser);

// Admin-only routes
router.get('/api/check-admin', isAdmin, (req, res) => {
  res.json({ isAdmin: true });
});
router.post('/api/objectives', isAdmin, createObjective);

// Authenticated user routes (not necessarily admin)
router.get('/api/objectives', isAuthenticated, getObjectives);

router.post('/api/validate-token', validateToken);

