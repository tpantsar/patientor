/**
 * Helper function for exhaustive type checking
 */
export const assertNever = (entry: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(entry)}`);
};
