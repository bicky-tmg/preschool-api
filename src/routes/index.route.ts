import express from 'express';
import eventRoutes from './event.route.js';
import faqRoutes from './faq.route.js';
import contentTypeRoutes from './contentType.route.js';

const router = express.Router();

router.use('/event', eventRoutes);
router.use('/faq', faqRoutes);
router.use('/content-type', contentTypeRoutes);

export default router;
