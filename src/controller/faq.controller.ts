import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import {
    createFaqService,
    deleteFaqService,
    getAllFaqsService,
    getFaqService,
    updateFaqService,
} from '../service/faq.service.js';
import type { FaqFilterQuery } from '../validation/faq.schema.js';

export const createFaq = catchAsync(async (req: Request, res: Response) => {
    const Faq = await createFaqService(req.body);
    res.sendResponse(Faq, 'Faq created successfully.', 201);
});

export const updateFaq = catchAsync(async (req: Request, res: Response) => {
    const Faq = await updateFaqService(req.params.id!, req.body);

    res.sendResponse(Faq, 'Faq updated successfully.');
});

export const getAllFaqs = catchAsync(async (req: Request, res: Response) => {
    const Faqs = await getAllFaqsService(req.query as unknown as FaqFilterQuery);

    res.sendResponse(Faqs);
});

export const getFaq = catchAsync(async (req: Request, res: Response) => {
    const Faq = await getFaqService(req.params.id!);

    res.sendResponse(Faq);
});

export const deleteFaq = catchAsync(async (req: Request, res: Response) => {
    await deleteFaqService(req.params.id!);

    res.sendResponse(undefined, 'Faq deleted successfully.');
});
