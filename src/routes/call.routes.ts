import { Router } from 'express';
import * as callController from '../controllers/call.controller.js';

const router = Router();

router.get('/', callController.getCalls);
router.get('/:id', callController.getCallById);
router.post('/sync', callController.syncCalls);
router.delete('/:id', callController.deleteCall);

export default router;
