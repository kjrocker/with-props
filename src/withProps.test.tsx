import { shallow } from 'enzyme';
import * as React from 'react';
import sinon from 'sinon';
import withProps from './withProps';

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

describe('when mapProps doesnt depend on props', () => {
  const setDefaultClass = () => ({ className: 'default' });

  it('transforms props', () => {
    const mapProps = sinon.spy(setDefaultClass);
    const Component = withProps(mapProps)(BaseDiv);
    const wrapper = shallow(<Component aria-label="test" />);
    expect(wrapper.find(BaseDiv).props()).toMatchObject({ className: 'default', 'aria-label': 'test' });
  });

  it('lets passed props win', () => {
    const mapProps = sinon.spy(setDefaultClass);
    const Component = withProps(mapProps)(BaseDiv);
    const wrapper = shallow(<Component className="special" />);
    expect(wrapper.find(BaseDiv).props()).toMatchObject({ className: 'special' });
  });

  it('runs once', () => {
    const mapProps = sinon.spy(setDefaultClass);
    const Component = withProps(mapProps)(BaseDiv);
    const wrapper = shallow(<Component className="special" />);
    wrapper.setProps({ className: 'very-special' });
    expect(wrapper.find(BaseDiv).props()).toMatchObject({ className: 'very-special' });
    expect(mapProps.calledOnce).toBeTruthy();
  });
});

describe('when mapProps depends on props', () => {
  const setClass = ({ primary }) => ({ className: primary ? 'primary' : 'default' });

  it('transforms props', () => {
    const mapProps = sinon.spy(setClass);
    const Component = withProps(mapProps)(BaseDiv);
    const wrapper = shallow(<Component aria-label="test" primary={true} />);
    expect(wrapper.find(BaseDiv).props()).toMatchObject({ className: 'primary', 'aria-label': 'test' });
  });

  it('lets passed props win', () => {
    const mapProps = sinon.spy(setClass);
    const Component = withProps(mapProps)(BaseDiv);
    const wrapper = shallow(<Component className="special" primary={true} />);
    expect(wrapper.find(BaseDiv).props()).toMatchObject({ className: 'special' });
  });

  it('runs once when props stay constant', () => {
    const mapProps = sinon.spy(setClass);
    const Component = withProps(mapProps)(BaseDiv);
    const wrapper = shallow(<Component primary={true} />);
    wrapper.setProps({ primary: true });
    expect(wrapper.find(BaseDiv).props()).toMatchObject({ className: 'primary' });
    expect(mapProps.calledOnce).toBeTruthy();
  });

  it('runs twice if props change', () => {
    const mapProps = sinon.spy(setClass);
    const Component = withProps(mapProps)(BaseDiv);
    const wrapper = shallow(<Component primary={true} />);
    wrapper.setProps({ primary: false });
    expect(wrapper.find(BaseDiv).props()).toMatchObject({ className: 'default' });
    expect(mapProps.calledTwice).toBeTruthy();
  });
});
