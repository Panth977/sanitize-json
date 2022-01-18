import { sanitizer } from './types';

type empty = undefined | null;
type falsy = empty | '' | 0 | false;

function orLoop(val: any, is: sanitizer[], name: string) {
  let i: sanitizer;
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

export function isUndefinedOr(...is: sanitizer[]): sanitizer {
  return function(val) {
    if (val === undefined) return undefined;
    return orLoop(val, is, 'isUndefinedOr');
  };
}
export function isNullOr(...is: sanitizer[]): sanitizer {
  return function(val) {
    if (val === null) return null;
    return orLoop(val, is, 'isNullOr');
  };
}
export function isEmptyOr(...is: sanitizer[]): sanitizer {
  return function(val) {
    if (val === null || val === undefined) return val;
    return orLoop(val, is, 'isEmptyOr');
  };
}
export function isFalsyOr(...is: sanitizer[]): sanitizer {
  return function(val) {
    if (!val) return undefined;
    return orLoop(val, is, 'isFalsyOr');
  };
}
export function isUndefined(val: undefined): undefined {
  if (val === undefined) return undefined;
  throw new Error('wrong type');
}
export function isNull(val: null): null {
  if (val === null) return null;
  throw new Error('wrong type');
}
export function isEmpty(val: empty): empty {
  if (val === null || val === undefined) return val;
  throw new Error('wrong type');
}
export function isFalsy(val: falsy): falsy {
  if (!val) return val;
  throw new Error('wrong type');
}
export function isTruly(val: any): any {
  if (val) return val;
  throw new Error('wrong type');
}
export function isSymbol(val: symbol): symbol {
  if (typeof val === 'symbol') return val;
  throw new Error('wrong type');
}
export function isString(val: string): string {
  if (typeof val === 'string') return val;
  throw new Error('wrong type');
}
export function isNumber(val: number): number {
  if (typeof val === 'number') return val;
  throw new Error('wrong type');
}
export function isBoolean(val: boolean): boolean {
  if (typeof val === 'boolean') return val;
  throw new Error('wrong type');
}
export function isBigint(val: bigint): bigint {
  if (typeof val === 'bigint') return val;
  throw new Error('wrong type');
}
