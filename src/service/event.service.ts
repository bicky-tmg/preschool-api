import type { Prisma } from '../generated/prisma/client.js';
import type { EventStatus } from '../generated/prisma/enums.js';
import { prisma } from '../lib/prisma.js';
import AppError from '../utils/appError.js';
import { paginate } from '../utils/common.js';
import type { EventFilterQuery, EventPayload } from '../validation/event.schema.js';

export const findEventById = async (id: string) => await prisma.event.findUnique({ where: { id } });
export const findEventByIdWithActivities = async (id: string) =>
    await prisma.event.findUnique({ where: { id }, include: { activites: true } });

export const createEventService = async (payload: EventPayload) => {
    const { activities, ...data } = payload;
    const event = await prisma.event.create({
        data: {
            ...data,
            status: data.status as EventStatus,
            activites: {
                createMany: {
                    data: activities,
                },
            },
        },
        include: { activites: true },
    });

    return { event };
};

export const updateEventService = async (id: string, payload: EventPayload) => {
    const { activities, ...data } = payload;
    const eventExists = await findEventById(id);

    if (!eventExists) {
        throw new AppError('Event not found.', 404);
    }

    const event = await prisma.$transaction(async (tx) => {
        const updatedEvent = await tx.event.update({
            where: { id },
            data: {
                ...data,
                status: data.status as EventStatus,
            },
        });

        await tx.eventActivity.deleteMany({ where: { eventId: updatedEvent.id } });

        const activitiesData = activities.map((activity) => ({
            ...activity,
            eventId: updatedEvent.id,
        }));
        const newActivities = await tx.eventActivity.createManyAndReturn({
            data: activitiesData,
        });

        return {
            ...updatedEvent,
            activities: newActivities,
        };
    });

    return { event };
};

export const getAllEventsService = async (query: EventFilterQuery) => {
    const { page = 1, limit = 10, search, startDate, endDate, status, isActive } = query;

    let filterQuery: Prisma.EventWhereInput = {};

    if (search) {
        const keywords = search.split(' ');
        filterQuery = {
            ...filterQuery,
            OR: keywords.map((keyword) => ({
                OR: [
                    { title: { contains: keyword, mode: 'insensitive' } },
                    { description: { contains: keyword, mode: 'insensitive' } },
                    { location: { contains: keyword, mode: 'insensitive' } },
                    {
                        activites: {
                            some: {
                                OR: [
                                    { title: { contains: keyword, mode: 'insensitive' } },
                                    { description: { contains: keyword, mode: 'insensitive' } },
                                ],
                            },
                        },
                    },
                ],
            })),
        };
    }

    if (startDate) {
        filterQuery = {
            ...filterQuery,
            startDate: { gte: new Date(startDate) },
        };
    }

    if (endDate) {
        filterQuery = {
            ...filterQuery,
            endDate: { lte: new Date(endDate) },
        };
    }

    if (isActive !== undefined) {
        filterQuery = { ...filterQuery, isActive };
    }

    if (status) {
        filterQuery = { ...filterQuery, status: { equals: status as EventStatus } };
    }

    const [events, total] = await Promise.all([
        await prisma.event.findMany({
            where: filterQuery,
            skip: limit * page - limit,
            take: limit,
        }),
        await prisma.event.count({ where: filterQuery }),
    ]);
    const pagination = paginate(page, limit, total);

    return { events, pagination };
};

export const getEventService = async (id: string) => {
    const event = await findEventByIdWithActivities(id);

    if (!event) {
        throw new AppError('Event not found.', 404);
    }

    return { event };
};

export const deleteEventService = async (id: string) => {
    const event = await findEventById(id);

    if (!event) {
        throw new AppError('Event not found.', 404);
    }

    await prisma.event.delete({ where: { id } });
};
