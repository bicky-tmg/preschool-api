import z from 'zod';
import { FieldType } from '../generated/prisma/enums.js';

const fieldType = Object.values(FieldType);

export const fieldTypeSchema = z.enum(fieldType);

export const fieldSchema = z.object({
    name: z.string().trim().min(1),
    displayName: z.string().trim().min(1),
    fieldType: fieldTypeSchema,
    isRequired: z.boolean().default(false).optional(),
    isUnique: z.boolean().default(false).optional(),
    defaultValue: z.any().nullable().optional(),
    validations: z.any().nullable().optional(),
    options: z.any().nullable().optional(),
    order: z.number().int().default(0).optional(),
});

export const contentTypeSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    displayName: z.string().trim().min(1, 'Display name is required'),
    description: z.string().trim().optional(),
    fields: z.array(fieldSchema).default([]),
});

export const contentTypeFilterQuerySchema = z
    .object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10),
        search: z.string().trim().optional(),
    })
    .strip();

export type ContentTypePayload = z.infer<typeof contentTypeSchema>;
export type FieldPayload = z.infer<typeof fieldSchema>;
export type ContentTypeFilterQuery = z.infer<typeof contentTypeFilterQuerySchema>;
