import { JP_PHONE_LOCALE } from "shared/constants/global.constants";
import { BasePaginationRequestDTO } from "shared/dtos/base-pagination-request.dto";

const removeBlacklistFields = (object: unknown, blacklistFields: string[]) => {
  blacklistFields.forEach((field) => delete object[field]);
};

const parseToPhoneNumberJPLocale = (phoneNumber: string): string => {
  return phoneNumber.startsWith("0") ? JP_PHONE_LOCALE + phoneNumber.slice(1) : phoneNumber;
};

const formatMessageString = (str: string, ...args: unknown[]): string => {
  return `${str}`.replace(/\{(\d+)\}/g, (match, index) => (args[index] || match) as string);
};

const transformPaginationQuery = (query: BasePaginationRequestDTO, scalarFieldEnum?: object) => {
  const sortByField =
    query.sortBy && Object.keys(scalarFieldEnum).includes(query.sortBy)
      ? { [query.sortBy]: query.direction || "asc" }
      : undefined;

  return { take: query.limit || undefined, skip: query.page ? (query.page - 1) * query.limit : undefined, sortByField };
};

export const CommonHelpers = {
  removeBlacklistFields,
  parseToPhoneNumberJPLocale,
  formatMessageString,
  transformPaginationQuery,
};
