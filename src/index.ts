import { sanitizer } from './types';

export * from './extra';
export * from './logic';
export * from './object';
export * from './premitive';

export function sanitizeJson<T>(
  using: sanitizer<T>,
  dirtyJsonObject: any
): { err: true; error: any } | { err: false; val: T } {
  try {
    return { err: false, val: using(dirtyJsonObject) };
  } catch (error) {
    return { err: true, error };
  }
}
