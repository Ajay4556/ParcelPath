import express from 'express';
import { fetchUnverifiedProviders, verifyProvider } from '../Controllers/manageVerifiedUser.js';
const router = express.Router();

router.get('/fetchProviders', fetchUnverifiedProviders);
router.put('/verifyProvider/:id', verifyProvider);

export default router