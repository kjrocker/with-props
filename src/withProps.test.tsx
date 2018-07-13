import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import sinon from 'sinon';
import withProps from './withProps';

configure({ adapter: new Adapter() as any });

const BaseDiv: React.ComponentType<any> = (props) => <div {...props} />;

describe('mapProps naming', () => {
  it('wraps the name correctly', () => {
    BaseDiv.displayName = 'DIV';
    const WrappedComponent = withProps(() => ({}))(BaseDiv);
    expect(WrappedComponent.displayName).toBe('withProps(DIV)');
  });

  it('falls back to .name when displayName is unavailable', () => {
    BaseDiv.displayName = undefined;
    const WrappedComponent = withProps(() => ({}))(BaseDiv);
    expect(WrappedComponent.displayName).toBe('withProps(BaseDiv)');
  });

  it('falls back to Component when all else fails', () => {
    const WrappedComponent = withProps(() => ({}))((props) => <div />);
    expect(WrappedComponent.displayName).toBe('withProps(Component)');
  });
});

const setDefaultClass = () => ({ className: 'default' });

describe('transforms props', () => {
  it('injects new props', () => {
    const mapProps = sinon.spy(setDefaultClass);
    const Component = withProps(mapProps)(BaseDiv);
    const wrapper = shallow(<Component aria-label="test" />);
    expect(wrapper.find(BaseDiv).props()).toMatchObject({ className: 'default', 'aria-label': 'test' });
  });

  it('overrides passed props if necessary', () => {
    const mapProps = sinon.spy(setDefaultClass);
    const Component = withProps(mapProps)(BaseDiv);
    const wrapper = shallow(<Component className="special" />);
    expect(wrapper.find(BaseDiv).props()).toMatchObject({ className: 'default' });
  });
});

describe('rendering', () => {
  it('avoids unnecessary rerenders', () => {
    const renderSpy = jest.fn(() => <div />);
    const Component = withProps(setDefaultClass)(renderSpy);
    const wrapper = mount(<Component />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    wrapper.update();
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
