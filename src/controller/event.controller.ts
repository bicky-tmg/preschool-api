import type { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import {
    createEventService,
    deleteEventService,
    getAllEventsService,
    getEventService,
    updateEventService,
} from '../service/event.service.js';
import type { EventFilterQuery } from '../validation/event.schema.js';

export const createEvent = catchAsync(async (req: Request, res: Response) => {
    const event = await createEventService(req.body);
    res.sendResponse(event, 'Event created successfully.', 201);
});

export const updateEvent = catchAsync(async (req: Request, res: Response) => {
    const event = await updateEventService(req.params.id!, req.body);

    res.sendResponse(event, 'Event updated successfully.');
});

export const getAllEvents = catchAsync(async (req: Request, res: Response) => {
    const events = await getAllEventsService(req.query as unknown as EventFilterQuery);

    res.sendResponse(events);
});

export const getEvent = catchAsync(async (req: Request, res: Response) => {
    const event = await getEventService(req.params.id!);

    res.sendResponse(event);
});

export const deleteEvent = catchAsync(async (req: Request, res: Response) => {
    await deleteEventService(req.params.id!);

    res.sendResponse(undefined, 'Event deleted successfully.');
});
