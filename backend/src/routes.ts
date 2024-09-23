import { Router } from 'express';
import { register, login, validateToken } from './controllers/authController';
import { isAdmin, isAuthenticated } from './middleware/authMiddleware';
import { setUser } from './middleware/setUser';
import rewardsRoutes from './routes/rewardsRoutes';
import objectiveTypesRoutes from './routes/objectiveTypesRoutes';
import objectiveGroupsRoutes from './routes/objectiveGroupsRoutes';
import objectivesRoutes from './routes/objectivesRoutes';
import requirementsRoutes from './routes/requirementsRoutes';
import conditionsRoutes from './routes/conditionsRoutes';
import countriesRoutes from './routes/countriesRoutes';
import leaguesRoutes from './routes/leaguesRoutes';
import teamsRoutes from './routes/teamsRoutes';
import playerAttributesRoutes from './routes/playerAttributesRoutes';
import playerAttributeRatingsRoutes from './routes/playerAttributeRatingsRoutes';
import positionsRoutes from './routes/positionsRoutes';
import playersRoutes from './routes/playersRoutes';
import feetRoutes from './routes/feetRoutes';
import bodyTypesRoutes from './routes/bodyTypesRoutes';
import acceleRATETypesRoutes from './routes/acceleRATETypesRoutes';

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
router.use('/api/requirements', requirementsRoutes);
router.use('/api/conditions', conditionsRoutes);
router.use('/api/countries', countriesRoutes);
router.use('/api/leagues', leaguesRoutes);
router.use('/api/teams', teamsRoutes);
router.use('/api/playerattributes', playerAttributesRoutes);
router.use('/api/playerattributeratings', playerAttributeRatingsRoutes);
router.use('/api/positions', positionsRoutes);
router.use('/api/players', playersRoutes);
router.use('/api/feet', feetRoutes);
router.use('/api/bodytypes', bodyTypesRoutes);
router.use('/api/acceleratetypes', acceleRATETypesRoutes);

// Authenticated user routes (not necessarily admin)
router.use('/api', isAuthenticated);
router.post('/api/validate-token', validateToken);