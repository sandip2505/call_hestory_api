import { Router } from 'express';
import * as recordingController from '../controllers/recording.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.post('/upload', upload.single('file'), recordingController.uploadRecording);
router.get('/', recordingController.getRecordings);
router.get('/:id', recordingController.getRecordingById);
router.get('/:id/stream', recordingController.streamRecording);
router.delete('/:id', recordingController.deleteRecording);

export default router;
