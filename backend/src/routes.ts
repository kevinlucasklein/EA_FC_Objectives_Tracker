import { Router } from 'express';
import { register, login, validateToken } from './controllers/authController';
import { createObjective, getObjectives } from './controllers/objectiveController';
import { isAdmin, isAuthenticated } from './middleware/authMiddleware';
import { setUser } from './middleware/setUser';
import rewardsRoutes from './routes/rewardsRoutes';
import objectiveTypesRoutes from './routes/objectiveTypesRoutes';
import objectiveGroupsRoutes from './routes/objectiveGroupsRoutes';

export const router = Router();

// Public routes
router.post('/api/register', register);
router.post('/api/login', login);

// Use setUser middleware for routes that require authentication
router.use(setUser);

// Admin-only routes
router.use('/api', isAdmin);
router.get('/api/check-admin', (req, res) => res.json({ isAdmin: true }));
router.post('/api/objectives', createObjective);

// Use rewards routes
router.use('/api/rewards', rewardsRoutes);

// Use objective types routes
router.use('/api/objectivetypes', objectiveTypesRoutes);

// Use objective groups routes
router.use('/api/objectivegroups', objectiveGroupsRoutes);

// Authenticated user routes (not necessarily admin)
router.use('/api', isAuthenticated);
router.get('/api/objectives', getObjectives);
router.post('/api/validate-token', validateToken);