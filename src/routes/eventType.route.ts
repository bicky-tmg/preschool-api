import express from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import { eventTypeFilterQuerySchema, eventTypeSchema } from '../validation/event.schema.js';
import {
    createEventType,
    deleteEventType,
    getAllEventTypes,
    getEventType,
    updateEventType,
} from '../controller/eventType.controller.js';

const router = express.Router();

router
    .route('/')
    .post(validateRequest(eventTypeSchema), createEventType)
    .get(validateRequest(eventTypeFilterQuerySchema, 'query'), getAllEventTypes);

router
    .route('/:id')
    .put(validateRequest(eventTypeSchema), updateEventType)
    .get(getEventType)
    .delete(deleteEventType);

export default router;
