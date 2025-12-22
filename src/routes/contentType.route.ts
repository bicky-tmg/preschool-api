import express from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import {
    contentTypeFilterQuerySchema,
    contentTypeSchema,
} from '../validation/contentType.schema.js';
import {
    createContentType,
    getAllContentTypes,
    getContentType,
    deleteContentType,
    updateContentType,
} from '../controller/contentType.controller.js';

const router = express.Router();

router
    .route('/')
    .post(validateRequest(contentTypeSchema), createContentType)
    .get(validateRequest(contentTypeFilterQuerySchema), getAllContentTypes);

router
    .route('/:id')
    .put(validateRequest(contentTypeSchema), updateContentType)
    .get(getContentType)
    .delete(deleteContentType);

export default router;
