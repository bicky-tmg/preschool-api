import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import {
    createContentTypeService,
    getAllContentTypesService,
    getContentTypeService,
    deleteContentTypeService,
    updateContentTypeService,
} from '../service/contentType.service.js';
import type { ContentTypeFilterQuery } from '../validation/contentType.schema.js';

export const createContentType = catchAsync(async (req: Request, res: Response) => {
    const contentType = await createContentTypeService(req.body);
    res.sendResponse(contentType, 'Content Type created successfully.', 201);
});

export const updateContentType = catchAsync(async (req: Request, res: Response) => {
    const contentType = await updateContentTypeService(req.params.id!, req.body);

    res.sendResponse(contentType, 'Content Type updated successfully.');
});

export const getAllContentTypes = catchAsync(async (req: Request, res: Response) => {
    const contentTypes = await getAllContentTypesService(
        req.query as unknown as ContentTypeFilterQuery,
    );
    res.sendResponse(contentTypes);
});

export const getContentType = catchAsync(async (req: Request, res: Response) => {
    const contentType = await getContentTypeService(req.params.id!);
    res.sendResponse(contentType);
});

export const deleteContentType = catchAsync(async (req: Request, res: Response) => {
    await deleteContentTypeService(req.params.id!);
    res.sendResponse(undefined, 'Content Type deleted successfully.');
});
