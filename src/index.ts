import { sanitizer } from './types';

export * from './isChecks';
export * from './logic';
export * from './object';
export * from './verify';

export function sanitizeJson(
  using: sanitizer,
  dirtyJsonObject: any
): { err: true; val: any } | { err: false; val: any } {
  try {
    return { err: false, val: using(dirtyJsonObject) };
  } catch (e) {
    return { err: true, val: e };
  }
}
