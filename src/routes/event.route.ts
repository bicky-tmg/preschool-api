import express from 'express';
import {
    createEvent,
    deleteEvent,
    getAllEvents,
    getEvent,
    updateEvent,
} from '../controller/event.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { eventFilterQuerySchema, eventSchema } from '../validation/event.schema.js';
import eventTypeRoutes from './eventType.route.js';

const router = express.Router();

router.use('/type', eventTypeRoutes);

router
    .route('/')
    .post(validateRequest(eventSchema), createEvent)
    .get(validateRequest(eventFilterQuerySchema, 'query'), getAllEvents);

router
    .route('/:id')
    .put(validateRequest(eventSchema), updateEvent)
    .get(getEvent)
    .delete(deleteEvent);

export default router;
