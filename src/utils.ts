import { Dayjs } from 'dayjs';

/**
 * Helper function for exhaustive type checking
 */
export const assertNever = (entry: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(entry)}`);
};

export const formatDateAsString = (date: Dayjs | null): string => {
  if (!date) {
    return '';
  }
  return date.format('YYYY-MM-DD');
};
