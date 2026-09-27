import { Router } from 'express';
import * as locationController from '../controllers/location.controller.js';

const router = Router();

router.post('/sync', locationController.syncLocations);
router.get('/current', locationController.getCurrentLocation);
router.get('/history', locationController.getHistory);
router.get('/timeline', locationController.getTimeline);

export default router;
