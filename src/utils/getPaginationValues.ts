
import { IPaginationQuery } from "@/types/global.types";
import { PAGINATION_DEFAULTS } from "./constants";

export function getPaginationValues(data: IPaginationQuery): IPaginationQuery {
   
    const page = Math.max(Number.parseInt(String(data?.page || PAGINATION_DEFAULTS.PAGE)), PAGINATION_DEFAULTS.PAGE);
   
    const limit = Math.min(Number.parseInt(String(data?.limit || PAGINATION_DEFAULTS.LIMIT)), PAGINATION_DEFAULTS.MAX_LIMIT);
    const sort = data?.sort;
    const search = data?.search;

    return { page, limit, ...(sort && { sort }), ...(search && { search }) };
}