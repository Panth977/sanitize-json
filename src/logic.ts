import { isStructOf } from './object';
import { sanitizer } from './types';

export function either<T>(...fn: sanitizer<T>[]): sanitizer<T> {
  return function(val: any) {
    let f: sanitizer<T>;
    for (f of fn) {
      try {
        return f(val);
      } catch {}
    }
    throw new Error(`
    obj val \n
    = ${JSON.stringify(val)} \n
    is invalid type,\n
    type of val don't match to any type in either
    `);
  };
}

export function combine<T extends {}>(...fn: sanitizer<T>[]): sanitizer<T> {
  let f: sanitizer<T>;
  const obj: { [key: string]: sanitizer<T> } = {};
  for (f of fn) {
    f = f.prototype.obj;
    if (f) Object.assign(obj, f);
    else
      throw new Error(`
    sanitizer are invalid \n
    target sanitizers given in combine are not interface \n
    only interfaces sanitizers can be combined
    `);
  }
  return isStructOf(obj as any);
}
