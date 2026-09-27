import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/summary', dashboardController.getSummary);
router.get('/daily-calls', dashboardController.getDailyCalls);
router.get('/top-contacts', dashboardController.getTopContacts);
router.delete('/wipe-all', dashboardController.wipeAllData);

// For donut chart and others, we can use the summary which already contains callType stats

export default router;
