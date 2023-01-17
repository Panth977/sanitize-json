export interface sanitizer<T> {
  (val: T): T;
}
