import type { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import AppError from '../utils/appError.js';
import { paginate } from '../utils/common.js';
import type {
    ContentTypeFilterQuery,
    ContentTypePayload,
} from '../validation/contentType.schema.js';

export const findContentTypeByName = async (name: string, id?: string) =>
    await prisma.contentType.findFirst({
        where: { name: { equals: name, mode: 'insensitive' }, ...(id ? { NOT: { id } } : {}) },
    });

export const findContentTypeById = async (id: string) =>
    await prisma.contentType.findUnique({ where: { id } });

export const createContentTypeService = async (payload: ContentTypePayload) => {
    const { fields, ...data } = payload;
    const contentTypeExists = await findContentTypeByName(payload.name);

    if (contentTypeExists) {
        throw new AppError(`Content Type with name:${payload.name} already exists.`, 400);
    }

    const _fields = fields.map((field, idx) => ({
        ...field,
        isRequired: field?.isRequired ?? false,
        isUnique: field?.isUnique ?? false,
        order: field?.order ?? idx,
    }));

    const contentType = await prisma.contentType.create({
        data: {
            ...data,
            description: data?.description ?? null,
            fields: {
                createMany: {
                    data: _fields,
                },
            },
        },
        include: { fields: true },
    });

    return { contentType };
};

export const updateContentTypeService = async (id: string, payload: ContentTypePayload) => {
    const contentType = await findContentTypeById(id);

    if (!contentType) {
        throw new AppError('Content Type not found.', 404);
    }

    const existingContentType = await findContentTypeByName(payload.name, id);

    if (existingContentType) {
        throw new AppError(`Content Type with name: "${payload.name}" already exists.`, 400);
    }

    const { fields, ...data } = payload;
    const _fields = fields.map((field, idx) => ({
        ...field,
        isRequired: field?.isRequired ?? false,
        isUnique: field?.isUnique ?? false,
        order: field?.order ?? idx,
    }));

    const updatedContentType = await prisma.contentType.update({
        where: { id },
        data: {
            ...data,
            description: data?.description ?? null,
            fields: {
                deleteMany: {},
                createMany: {
                    data: _fields,
                },
            },
        },
        include: { fields: true },
    });

    return { contentType: updatedContentType };
};

export const getAllContentTypesService = async (query: ContentTypeFilterQuery) => {
    const { page = 1, limit = 10, search } = query;

    let filterQuery: Prisma.ContentTypeWhereInput = {};

    if (search) {
        const keywords = search.split(' ');
        filterQuery = {
            ...filterQuery,
            OR: keywords.map((keyword) => ({
                OR: [
                    { name: { contains: keyword, mode: 'insensitive' } },
                    { displayName: { contains: keyword, mode: 'insensitive' } },
                    { description: { contains: keyword, mode: 'insensitive' } },
                ],
            })),
        };
    }

    const [contentTypes, total] = await Promise.all([
        await prisma.contentType.findMany({
            where: filterQuery,
            skip: limit * page - limit,
            take: limit,
        }),
        await prisma.contentType.count({ where: filterQuery }),
    ]);
    const pagination = paginate(page, limit, total);

    return { contentTypes, pagination };
};

export const getContentTypeService = async (id: string) => {
    const contentType = await findContentTypeById(id);

    if (!contentType) {
        throw new AppError('Content Type not found.', 404);
    }

    return { contentType };
};

export const deleteContentTypeService = async (id: string) => {
    const contentType = await findContentTypeById(id);

    if (!contentType) {
        throw new AppError('Content Type not found.', 404);
    }

    const contentCount = await prisma.contentType.findFirst({
        where: { id },
        select: { _count: { select: { contents: true } } },
    });

    if (contentCount?._count?.contents) {
        throw new AppError('This content type contains items and cannot be deleted.', 400);
    }

    await prisma.contentType.delete({ where: { id } });
};
