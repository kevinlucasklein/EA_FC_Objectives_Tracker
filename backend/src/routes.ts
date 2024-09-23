import { Router } from 'express';
import { register, login, validateToken } from './controllers/authController';
import { isAdmin, isAuthenticated } from './middleware/authMiddleware';
import { setUser } from './middleware/setUser';
import rewardsRoutes from './routes/rewardsRoutes';
import objectiveTypesRoutes from './routes/objectiveTypesRoutes';
import objectiveGroupsRoutes from './routes/objectiveGroupsRoutes';
import objectivesRoutes from './routes/objectivesRoutes';

export const router = Router();

// Public routes
router.post('/api/register', register);
router.post('/api/login', login);

// Use setUser middleware for routes that require authentication
router.use(setUser);

// Admin-only routes
router.use('/api', isAdmin);
router.get('/api/check-admin', (req, res) => res.json({ isAdmin: true }));

// Use routes
router.use('/api/rewards', rewardsRoutes);
router.use('/api/objectivetypes', objectiveTypesRoutes);
router.use('/api/objectivegroups', objectiveGroupsRoutes);
router.use('/api/objectives', objectivesRoutes);

// Authenticated user routes (not necessarily admin)
router.use('/api', isAuthenticated);
router.post('/api/validate-token', validateToken);