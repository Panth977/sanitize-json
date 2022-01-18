import { obj, sanitizer } from './types';

export function applyOr(...fn: sanitizer[]) {
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
    type of val don't match to any type in applyOr
    `);
  };
}

export function switchOn(
  v: (val: any) => any,
  ...obj: { when: any; then: sanitizer }[]
) {
  return function(val: any) {
    let o;
    const c = v(val);
    for (o of obj) {
      if (c === o.when) {
        return o.then(val);
      }
    }
    throw new Error(`
    obj val \n
    = ${JSON.stringify(val)} \n
    is invalid value,\n
    target value don't match to any of the "when" value in switchOn
    `);
  };
}

export function combine(...fn: sanitizer[]) {
  return function(val: any) {
    let f;
    let o: obj = {};
    for (f of fn) {
      o = { ...o, ...f(val) };
    }
    return o;
  };
}
