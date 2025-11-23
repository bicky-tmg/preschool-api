import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import {
    createEventTypeService,
    deleteEventTypeService,
    getAllEventTypesService,
    getEventTypeService,
    updateEventTypeService,
} from '../service/eventType.service.js';
import type { EventTypeFilterQuery } from '../validation/event.schema.js';

export const createEventType = catchAsync(async (req: Request, res: Response) => {
    const eventType = await createEventTypeService(req.body);
    res.sendResponse(eventType, 'Event type created successfully.', 201);
});

export const updateEventType = catchAsync(async (req: Request, res: Response) => {
    const eventType = await updateEventTypeService(req.params.id!, req.body);

    res.sendResponse(eventType, 'Event type updated successfully.');
});

export const getAllEventTypes = catchAsync(async (req: Request, res: Response) => {
    const eventTypes = await getAllEventTypesService(req.query as unknown as EventTypeFilterQuery);

    res.sendResponse(eventTypes);
});

export const getEventType = catchAsync(async (req: Request, res: Response) => {
    const eventType = await getEventTypeService(req.params.id!);

    res.sendResponse(eventType);
});

export const deleteEventType = catchAsync(async (req: Request, res: Response) => {
    await deleteEventTypeService(req.params.id!);

    res.sendResponse(undefined, 'Event type deleted successfully.');
});
