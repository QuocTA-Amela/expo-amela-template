export function logger(msg: any, isWarning?: boolean, params?: any): void {
  if (__DEV__ && !isWarning) {
    if (params) console.log(msg, params);
    else console.log(msg);
  }
  if (__DEV__ && isWarning) {
    if (params) console.warn(msg, params);
    else console.warn(msg);
  }
}
