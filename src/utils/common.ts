import type { Pagination } from '../types/common.type.js';

export const paginate = (page: number, limit: number, total: number): Pagination => {
    const totalPage = Math.ceil(total / limit);
    const pagination: Pagination = {
        page,
        limit,
        totalPage,
        total,
    };
    return pagination;
};
