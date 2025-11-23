import express from 'express';
import { createEvent } from '../controller/event.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { eventSchema } from '../validation/event.schema.js';
import eventTypeRoutes from './eventType.route.js';

const router = express.Router();

router.use('/type', eventTypeRoutes);
router.route('/').post(validateRequest(eventSchema), createEvent);

export default router;
