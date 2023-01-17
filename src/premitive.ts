import { sanitizer } from './types';

type empty = undefined | null;
type falsy = empty | '' | 0 | false;

function orLoop<T>(val: any, is: sanitizer<T>[], name: string) {
  let i: sanitizer<T>;
  for (i of is) {
    try {
      return i(val);
    } catch {}
  }
  throw new Error(`
  obj val \n
  = ${JSON.stringify(val)} \n
  is invalid type,\n
  type of val don't match to any type in ${name}
  `);
}

export function isUndefinedOr<T>(
  ...is: sanitizer<T>[]
): sanitizer<T | undefined> {
  return function(val) {
    if (val === undefined) return undefined;
    return orLoop(val, is, 'isUndefinedOr');
  };
}
export function isNullOr<T>(...is: sanitizer<T>[]): sanitizer<T | null> {
  return function(val) {
    if (val === null) return null;
    return orLoop(val, is, 'isNullOr');
  };
}
export function isEmptyOr<T>(...is: sanitizer<T>[]): sanitizer<T | empty> {
  return function(val) {
    if (val === null || val === undefined) return val;
    return orLoop(val, is, 'isEmptyOr');
  };
}
export function isFalsyOr<T>(...is: sanitizer<T>[]): sanitizer<T | undefined> {
  return function(val) {
    if (!val) return undefined;
    return orLoop(val, is, 'isFalsyOr');
  };
}
export const hasValOf: {
  undefined: sanitizer<undefined>;
  null: sanitizer<null>;
  empty: sanitizer<empty>;
  falsy: sanitizer<falsy>;
  truly<T>(val: T): T;
  string: sanitizer<string>;
  number: sanitizer<number>;
  boolean: sanitizer<boolean>;
} = {
  undefined(val) {
    if (val === undefined) return undefined;
    throw new Error('wrong type');
  },
  null(val) {
    if (val === null) return null;
    throw new Error('wrong type');
  },
  empty(val) {
    if (val === null || val === undefined) return val;
    throw new Error('wrong type');
  },
  falsy(val) {
    if (!val) return val;
    throw new Error('wrong type');
  },
  truly(val) {
    if (val) return val;
    throw new Error('wrong type');
  },
  string(val) {
    if (typeof val === 'string') return val;
    throw new Error('wrong type, required of string');
  },
  number(val) {
    if (typeof val === 'number') return val;
    throw new Error('wrong type, required of number');
  },
  boolean(val) {
    if (typeof val === 'boolean') return val;
    throw new Error('wrong type, required of boolean');
  },
};
