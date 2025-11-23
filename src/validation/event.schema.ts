import { z } from 'zod';
import { EventStatus } from '../generated/prisma/enums.js';

const status = Object.values(EventStatus).map(String);

export const eventStatusSchema = z.enum(status);

export const eventActivitiesSchema = z.object({
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().nullable().optional().default(null),
    images: z.array(z.string()).default([]),
});

export const eventTypeSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    isActive: z.boolean().default(true),
});

export const eventFilterQuerySchema = z
    .object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10),
        search: z.string().trim().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        status: eventStatusSchema.default(EventStatus.SCHEDULED).optional(),
    })
    .refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
        message: 'End date must be same or after start date',
        path: ['endDate'],
    });

export const eventTypeFilterQuerySchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
    search: z.string().trim().optional(),
    isActive: z
        .enum(['true', 'false', '1', '0'])
        .transform((val) => val === 'true' || val === '1')
        .optional(),
});

export const eventSchema = z
    .object({
        title: z.string().trim().min(1, 'Title is required'),
        description: z.string().trim().min(1, 'Description is required'),
        status: eventStatusSchema.default(EventStatus.SCHEDULED),
        startDate: z.preprocess(
            (arg) => (arg === '' || arg == null ? undefined : new Date(arg as string)),
            z.date({
                error: (issue) =>
                    issue.input === undefined
                        ? 'Start date is required.'
                        : 'Start date must be a valid date',
            }),
        ),
        endDate: z.preprocess(
            (arg) => (arg === '' || arg == null ? undefined : new Date(arg as string)),
            z.date({
                error: (issue) =>
                    issue.input === undefined
                        ? 'End date is required.'
                        : 'End date must be a valid date',
            }),
        ),
        location: z.string().trim().nullable().optional().default(null),
        featuredImage: z.string().nullable().default(null),
        images: z.array(z.string()).default([]),
        eventType: z.string().min(1, 'Event type is required'),
        activities: z.array(eventActivitiesSchema).default([]),
    })
    .refine((data) => data.endDate >= data.startDate, {
        message: 'End date must be after start date',
        path: ['endDate'],
    });

export type EventPayload = z.infer<typeof eventSchema>;
export type EventActivityPayload = z.infer<typeof eventActivitiesSchema>;
export type EventTypePayload = z.infer<typeof eventTypeSchema>;
export type EventTypeFilterQuery = z.infer<typeof eventTypeFilterQuerySchema>;
export type EventFilterQuery = z.infer<typeof eventFilterQuerySchema>;
