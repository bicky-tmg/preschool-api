import type { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import AppError from '../utils/appError.js';
import { paginate } from '../utils/common.js';
import type { EventTypeFilterQuery, EventTypePayload } from '../validation/event.schema.js';

export const findEventTypeByName = async (name: string, id?: string) =>
    await prisma.eventType.findFirst({
        where: { name: { equals: name, mode: 'insensitive' }, ...(id ? { NOT: { id } } : {}) },
    });

export const findEventTypeById = async (id: string) =>
    await prisma.eventType.findUnique({ where: { id } });

export const createEventTypeService = async (payload: EventTypePayload) => {
    const { name } = payload;

    const eventTypeExists = await findEventTypeByName(name);

    if (eventTypeExists) {
        throw new AppError(`Event type with name: "${name}" already exists.`, 400);
    }

    const eventType = await prisma.eventType.create({
        data: payload,
    });

    return { eventType };
};

export const updateEventTypeService = async (id: string, payload: EventTypePayload) => {
    const { name } = payload;

    const eventTypeExists = await findEventTypeById(id);

    if (!eventTypeExists) {
        throw new AppError('Event type not found.', 404);
    }

    const uniqueEventTypeExists = await findEventTypeByName(name, id);

    if (uniqueEventTypeExists) {
        throw new AppError(`Event type with name: ${name} already exists.`, 400);
    }

    const eventType = await prisma.eventType.update({
        where: { id },
        data: payload,
    });

    return { eventType };
};

export const getAllEventTypesService = async (query: EventTypeFilterQuery) => {
    const { page = 1, limit = 10, search, isActive } = query;

    let filterQuery: Prisma.EventTypeWhereInput = {};

    if (search) {
        const keywords = search.split(' ');
        filterQuery = {
            ...filterQuery,
            OR: keywords.map((keyword) => ({
                OR: [{ name: { contains: keyword, mode: 'insensitive' } }],
            })),
        };
    }

    if (isActive !== undefined) {
        filterQuery = {
            ...filterQuery,
            isActive,
        };
    }

    const [eventTypes, total] = await Promise.all([
        await prisma.eventType.findMany({
            where: filterQuery,
            skip: limit * page - limit,
            take: limit,
        }),
        await prisma.eventType.count({ where: filterQuery }),
    ]);
    const pagination = paginate(page, limit, total);

    return { eventTypes, pagination };
};

export const getEventTypeService = async (id: string) => {
    const eventType = await findEventTypeById(id);

    if (!eventType) {
        throw new AppError('Event type not found.', 404);
    }

    return { eventType };
};

export const deleteEventTypeService = async (id: string) => {
    const eventType = await findEventTypeById(id);

    if (!eventType) {
        throw new AppError('Event type not found.', 404);
    }

    await prisma.eventType.delete({ where: { id } });
};
