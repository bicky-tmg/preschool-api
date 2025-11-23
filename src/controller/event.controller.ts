import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { createEventService } from '../service/event.service.js';

export const createEvent = catchAsync(async (req: Request, res: Response) => {
    const event = await createEventService(req.body);
    res.sendResponse(event, 'Event created successfully.', 201);
});
