import z from 'zod';

export const faqSchema = z.object({
    question: z.string().trim().min(1, 'Question is required'),
    answer: z.string().trim().min(1, 'Answer is required'),
    isActive: z.boolean().default(true),
    sortOrder: z.number().default(0),
});

export const faqFilterQuerySchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
    search: z.string().trim().optional(),
    isActive: z
        .enum(['true', 'false', '1', '0'])
        .transform((val) => val === 'true' || val === '1')
        .optional(),
});

export type FaqPayload = z.infer<typeof faqSchema>;
export type FaqFilterQuery = z.infer<typeof faqFilterQuerySchema>;
