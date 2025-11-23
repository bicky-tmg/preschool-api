import type { EventStatus } from '../generated/prisma/enums.js';
import { prisma } from '../lib/prisma.js';
import type { EventPayload } from '../validation/event.schema.js';

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
