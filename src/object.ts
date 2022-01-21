import { obj, sanitizer } from './types';

export function isListOf(f: sanitizer) {
  return function(val: any) {
    if (!Array.isArray(val))
      throw new Error(`  
        obj val \n
        = ${JSON.stringify(val)} \n
        is invalid value,\n
        value passed in isListOf is not an array
      `);
    let e;
    const newlist: any[] = [];
    for (e of val) {
      newlist.push(f(e));
    }
    return newlist;
  };
}

export function isMapOf(f: sanitizer) {
  return function(val: any) {
    if (typeof val !== 'object' || val === null)
      throw new Error(`
        obj val \n
        = ${JSON.stringify(val)} \n
        is invalid value,\n
        value passed in isMapOf is not an object or is null
      `);
    let k;
    const obj: { [key: string]: any } = {};
    for (k in val) {
      if (Object.prototype.hasOwnProperty.call(val, k)) {
        obj[k] = f(val[k]);
      }
    }
    return obj;
  };
}

export function isArrayAs(fn: sanitizer[]) {
  return function(val: any) {
    if (!Array.isArray(val))
      throw new Error(`  
        obj val \n
        = ${JSON.stringify(val)} \n
        is invalid value,\n
        value passed in isArrayAs is not an array
      `);
    const newlist: any[] = [];
    for (let i = 0; i < fn.length; i++) {
      newlist.push(fn[i](val[i]));
    }
    return newlist;
  };
}

export function isInterfaceAs(obj: obj<sanitizer>) {
  function objSanitizer(val: any) {
    if (typeof val !== 'object' || val === null)
      throw new Error(`
        obj val \n
        = ${JSON.stringify(val)} \n
        is invalid value,\n
        value passed in isInterfaceAs is not an object or is null
      `);
    let k;
    const newObj: { [key: string]: any } = {};
    for (k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        newObj[k] = obj[k](val[k]);
      }
    }
    return newObj;
  }
  objSanitizer.prototype.obj = obj;
  return objSanitizer;
}
