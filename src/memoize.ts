import shallowEqual from './shallowEqual';

const memoize = <P, R>(fn: (props?: P) => R) => {
  if (fn.length === 0) {
    let returnValue = fn();
    return () => returnValue;
  } else {
    let prevArg: P;
    let returnValue: R;
    return (arg: P) => {
      if (shallowEqual(arg, prevArg)) {
        return returnValue;
      } else {
        returnValue = fn(arg);
        prevArg = arg;
        return returnValue;
      }
    };
  }
};

export default memoize;
