import { isInterfaceAs } from '.';
import { obj, sanitizer } from './types';

export function either(...fn: sanitizer[]) {
  return function(val: any) {
    let f;
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

export function switchOn(
  v: (val: any) => string,
  when: obj<sanitizer>,
  defaultCase?: sanitizer
) {
  return function(val: any) {
    let a = when[v(val)];
    if (a) return a(val);
    if (defaultCase) return defaultCase(val);
    throw new Error(`
    obj val \n
    = ${JSON.stringify(val)} \n
    is invalid value,\n
    target value don't match to any of the "when" value in switchOn
    `);
  };
}

export function combine(...fn: sanitizer[]) {
  let f;
  const obj: obj<sanitizer> = {};
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
  return isInterfaceAs(obj);
}
