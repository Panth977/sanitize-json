export interface sanitizer {
  (val: any): any;
}

export interface obj<T = any> {
  [key: string]: T;
}
