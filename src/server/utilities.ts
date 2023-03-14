import { type Request } from 'express';
import isString from 'lodash/isString';

export function getQueryParamAsNumber(query: Request['query'], paramName: string): number | undefined {
  const value = query[paramName];
  if (Number.isNaN(Number(value))) {
    // eslint-disable-next-line no-console
    console.warn(`Error reading param name ${paramName}, expected to be a number but got ${String(value)}`);
    return undefined;
  }
  return Number(value);
}

export function getQueryParamAsString(query: Request['query'], paramName: string): string | undefined {
  const value = query[paramName];
  if (value === null || !isString(value)) {
    return undefined;
  }
  return value;
}
