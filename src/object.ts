import { sanitizer } from './types';

export function isListOf<T>(f: sanitizer<T>): sanitizer<T[]> {
  return function(val: T[]) {
    if (!Array.isArray(val))
      throw new Error(`  
        obj val \n
        = ${JSON.stringify(val)} \n
        is invalid value,\n
        value passed in isListOf is not an array
      `);
    let e: T;
    const newlist: T[] = [];
    for (e of val) newlist.push(f(e));
    return newlist;
  };
}

export function isMapOf<T>(
  f: sanitizer<T>,
  ignoreOnFail = true
): sanitizer<{ [key: string]: T }> {
  return function(val: { [key: string]: T }) {
    if (typeof val !== 'object' || val === null)
      throw new Error(`
        obj val \n
        = ${JSON.stringify(val)} \n
        is invalid value,\n
        value passed in isMapOf is not an object or is null
      `);
    let k: string;
    const obj: { [key: string]: T } = {};
    if (ignoreOnFail) {
      for (k in val) {
        if (!Object.prototype.hasOwnProperty.call(val, k)) continue;
        try {
          obj[k] = f(val[k]);
        } catch {}
      }
    } else {
      for (k in val) {
        if (!Object.prototype.hasOwnProperty.call(val, k)) continue;
        obj[k] = f(val[k]);
      }
    }
    return obj;
  };
}

type ArrayUnion<A, B> = A extends Array<any>
  ? B extends Array<any>
    ? [...A, ...B]
    : never
  : never;

type MapSanitizor<T> = T extends [infer P1, ...(infer Rest)]
  ? ArrayUnion<[sanitizer<P1>], MapSanitizor<Rest>>
  : [];

export function isArrayAs<T extends any[]>(fn: MapSanitizor<T>): sanitizer<T> {
  return function(val) {
    if (!Array.isArray(val))
      throw new Error(`
        obj val \n
        = ${JSON.stringify(val)} \n
        is invalid value,\n
        value passed in isArrayAs is not an array
      `);
    const newlist: T = [] as any;
    for (let i = 0; i < fn.length; i++) {
      newlist.push((fn[i] as any)(val[i]));
    }
    return newlist;
  };
}

export function isStructOf<T extends {}>(
  obj: { [key in keyof T]: sanitizer<T[key]> }
): sanitizer<T> {
  function objSanitizer(val: { [key in keyof T]: T[key] }) {
    if (typeof val !== 'object' || val === null)
      throw new Error(`
        obj val \n
        = ${JSON.stringify(val)} \n
        is invalid value,\n
        value passed in isStructOf is not an object or is null
      `);
    const newObj: { [key in keyof T]: T[key] } = {} as any;
    let k: keyof T;
    for (k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
      newObj[k] = obj[k](val[k]);
    }
    return newObj;
  }
  objSanitizer.prototype.obj = obj;
  return objSanitizer;
}
