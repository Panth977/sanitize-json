import { sanitizer } from './types';

const emailRegx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const e164PhoneRegx = /^\+[1-9]\d{10,14}$/;
export const isEmail: sanitizer<string> = function(val) {
  if (val.match(emailRegx)) return val;
  throw new Error(`${JSON.stringify(val)} is not email`);
};
export const isE164PhoneNumber: sanitizer<string> = function(val) {
  if (val.match(e164PhoneRegx)) return val;
  throw new Error(`${JSON.stringify(val)} is not e164. formated phone number`);
};
export const isInteger: sanitizer<number> = function(val) {
  if (Number.isInteger(val)) return val;
  throw new Error(`${JSON.stringify(val)} is not integer`);
};
export function is<T>(f: (val: T) => boolean): sanitizer<T> {
  return function(val: any) {
    if (f(val)) return val;
    throw new Error(
      `${JSON.stringify(val)} dosn't pass given function in isTrueOnCall`
    );
  };
}
export function shouldBe(
  op: '>' | '<' | '>=' | '<=' | '!=' | '==' | '!==' | '===',
  num: any
): sanitizer<number> {
  return function(val) {
    switch (op) {
      case '>': {
        if (val > num) return val;
        break;
      }
      case '<': {
        if (val < num) return val;
        break;
      }
      case '>=': {
        if (val >= num) return val;
        break;
      }
      case '<=': {
        if (val <= num) return val;
        break;
      }
      case '==': {
        if (val == num) return val;
        break;
      }
      case '!=': {
        if (val != num) return val;
        break;
      }
      case '===': {
        if (val === num) return val;
        break;
      }
      case '!==': {
        if (val !== num) return val;
        break;
      }
    }
    throw new Error(`opration (val ${op} num)  is not true`);
  };
}
export function checkIfIt<T>(...fn: sanitizer<T>[]): sanitizer<T> {
  return function(val: any) {
    let f: sanitizer<T>;
    for (f of fn) {
      val = f(val);
    }
    return val;
  };
}
export function matches(regex: RegExp): sanitizer<string> {
  return function(val) {
    if (val.match(regex)) return val;
    throw new Error(`${JSON.stringify(val)} don't match regex ${regex}`);
  };
}
