import { Router } from 'express';
import * as deviceController from '../controllers/device.controller.js';

const router = Router();

router.get('/', deviceController.getDevices);
router.get('/:id', deviceController.getDeviceById);

export default router;
