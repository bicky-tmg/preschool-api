import express from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import eventTypeRoutes from './eventType.route.js';
import { faqFilterQuerySchema, faqSchema } from '../validation/faq.schema.js';
import {
    createFaq,
    deleteFaq,
    getAllFaqs,
    getFaq,
    updateFaq,
} from '../controller/faq.controller.js';

const router = express.Router();

router.use('/type', eventTypeRoutes);

router
    .route('/')
    .post(validateRequest(faqSchema), createFaq)
    .get(validateRequest(faqFilterQuerySchema, 'query'), getAllFaqs);

router.route('/:id').put(validateRequest(faqSchema), updateFaq).get(getFaq).delete(deleteFaq);

export default router;
