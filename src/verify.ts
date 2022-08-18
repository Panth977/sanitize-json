import { sanitizer } from './types';

const emailRegx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isEmail: sanitizer = function(val) {
  if (val.match(emailRegx)) return val;
  throw new Error(`${JSON.stringify(val)} is not email`);
};
export const isInteger: sanitizer = function(val) {
  if (Number.isInteger(val)) return val;
  throw new Error(`${JSON.stringify(val)} is not integer`);
};
export function is(f: (val: any) => boolean): sanitizer {
  return function(val: any) {
    if (f(val)) return val;
    throw new Error(
      `${JSON.stringify(val)} dosn't pass given function in isTrueOnCall`
    );
  };
}
export function isIt(
  op: '>' | '<' | '>=' | '<=' | '!=' | '==' | '!==' | '===',
  num: any
): sanitizer {
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
export function checkIfIt(...fn: sanitizer[]): sanitizer {
  return function(val: any) {
    let f;
    for (f of fn) {
      val = f(val);
    }
    return val;
  };
}
export function isE164PhoneNumber(phoneNumber: string) {
  return /^\+[1-9]\d{10,14}$/.test(phoneNumber);
}
