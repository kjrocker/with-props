import * as React from 'react';
import memoize from './memoize';

const getDisplayName = (component: React.ComponentType<any>): string =>
  component.displayName || (component as any).name || 'Component';

const withProps = <P, R>(mapPropsBase: (p?: P) => R) => {
  const mapProps = memoize(mapPropsBase) as (p?: P) => R;
  return (WrappedComponent: React.ComponentType<P & R>) => {
    const Component: React.SFC<P & Partial<R>> = (props) => <WrappedComponent {...props} {...mapProps(props)} />;
    Component.displayName = `withProps(${getDisplayName(WrappedComponent)})`;
    return Component;
  };
};

export default withProps;
