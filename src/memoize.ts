import shallowEqual from './shallowEqual';

const memoize = <Fn extends (props?: any) => any>(fn: Fn): Fn => {
  if (fn.length === 0) {
    let returnValue = fn();
    return ((() => returnValue) as any) as Fn;
  } else {
    let prevArg: any;
    let returnValue: any;
    return (((arg: any) => {
      if (shallowEqual(arg, prevArg)) {
        return returnValue;
      } else {
        returnValue = fn(arg);
        prevArg = arg;
        return returnValue;
      }
    }) as any) as Fn;
  }
};

export default memoize;
