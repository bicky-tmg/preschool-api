import { z } from 'zod';
import { EventStatus } from '../generated/prisma/enums.js';

const status = Object.values(EventStatus).map(String);

export const eventStatusSchema = z.enum(status);

export const eventActivitiesSchema = z.object({
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().nullable(),
    images: z.array(z.string()).default([]),
});

export const eventTypeSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
});

export const eventTypeFilterQuerySchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
    search: z.string().trim().optional(),
});

export const eventSchema = z
    .object({
        title: z.string().trim().min(1, 'Title is required'),
        description: z.string().trim().min(1, 'Description is required'),
        status: eventStatusSchema.default(EventStatus.SCHEDULED),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        location: z.string().trim().nullable(),
        featuredImage: z.string().nullable(),
        images: z.array(z.string()).default([]),
        eventTypeId: z.string(),
        activities: z.array(eventActivitiesSchema).default([]),
    })
    .refine((data) => data.endDate > data.startDate, {
        message: 'End date must be after start date',
        path: ['endDate'],
    });

export type EventPayload = z.infer<typeof eventSchema>;
export type EventActivityPayload = z.infer<typeof eventActivitiesSchema>;
export type EventTypePayload = z.infer<typeof eventTypeSchema>;
export type EventTypeFilterQuery = z.infer<typeof eventTypeFilterQuerySchema>;
