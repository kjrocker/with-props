import memoize from './memoize';
import * as sinon from 'sinon';
import { shallow } from 'enzyme';

const moveName = ({ name }: any) => ({ componentName: name });

const addSpecialProp = () => ({ reallyLongPropName: 'Use me to create variants of existing components!' });

describe('memoize', () => {
  it('works', () => {
    expect(true).toBe(true);
  });

  it('runs once when props stay constant', () => {
    const moveNameSpy = sinon.spy(moveName);
    const memoizedMoveName = memoize(moveNameSpy);

    for (let index = 0; index < 5; index++) {
      const result = memoizedMoveName({ name: 'Test' });
    }
    expect(moveNameSpy.calledOnce).toBe(true);
  });

  it('reruns whenever it might be needed', () => {
    const moveNameSpy = sinon.spy(moveName);
    const memoizedMoveName = memoize(moveNameSpy);
    memoizedMoveName({ name: 'First' });
    memoizedMoveName({ name: 'First', otherProp: 'Hello' });
    expect(moveNameSpy.callCount).toBe(2);
    memoizedMoveName({ name: 'Second', otherProp: 'Hello' });
    expect(moveNameSpy.callCount).toBe(3);
  });

  it('only runs once ever for zero argument functions', () => {
    const addSpecialPropSpy = sinon.spy(addSpecialProp);
    const memoizedAddSpecialProp = memoize(addSpecialPropSpy);
    memoizedAddSpecialProp();
    memoizedAddSpecialProp({});
    memoizedAddSpecialProp({ someStuff: 'Hi' });
    memoizedAddSpecialProp('Strings!');
    expect(addSpecialPropSpy.calledOnce).toBe(true);
  });
});
