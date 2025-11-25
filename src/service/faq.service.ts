import type { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import AppError from '../utils/appError.js';
import { paginate } from '../utils/common.js';
import type { FaqFilterQuery, FaqPayload } from '../validation/faq.schema.js';

export const findFaqById = async (id: string) => await prisma.faq.findUnique({ where: { id } });

export const createFaqService = async (payload: FaqPayload) => {
    const faq = await prisma.faq.create({
        data: payload,
    });

    return { faq };
};

export const updateFaqService = async (id: string, payload: FaqPayload) => {
    const faqExists = await findFaqById(id);

    if (!faqExists) {
        throw new AppError('Faq not found.', 404);
    }

    const faq = await prisma.faq.update({
        where: { id },
        data: payload,
    });

    return { faq };
};

export const getAllFaqsService = async (query: FaqFilterQuery) => {
    const { page = 1, limit = 10, search, isActive } = query;

    let filterQuery: Prisma.FaqWhereInput = {};

    if (search) {
        const keywords = search.split(' ');
        filterQuery = {
            ...filterQuery,
            OR: keywords.map((keyword) => ({
                OR: [
                    { question: { contains: keyword, mode: 'insensitive' } },
                    { answer: { contains: keyword, mode: 'insensitive' } },
                ],
            })),
        };
    }

    if (isActive !== undefined) {
        filterQuery = { ...filterQuery, isActive };
    }

    const [faqs, total] = await Promise.all([
        await prisma.faq.findMany({
            where: filterQuery,
            skip: limit * page - limit,
            take: limit,
        }),
        await prisma.faq.count({ where: filterQuery }),
    ]);
    const pagination = paginate(page, limit, total);

    return { faqs, pagination };
};

export const getFaqService = async (id: string) => {
    const faq = await findFaqById(id);

    if (!faq) {
        throw new AppError('Faq not found.', 404);
    }

    return { faq };
};

export const deleteFaqService = async (id: string) => {
    const faq = await findFaqById(id);

    if (!faq) {
        throw new AppError('Faq not found.', 404);
    }

    await prisma.faq.delete({ where: { id } });
};
