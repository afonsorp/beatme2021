/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';

import hoistNonReactStatic from 'hoist-non-react-statics';

export const contextHoc = (
  context,
  hocDisplayNamePrefix,
) => (WrappedComponent) => {
  class GenericContextHOC extends Component {
    static contextType = context;

    render() {
      // eslint-disable-next-line react/prop-types
      const { forwardRef, ...rest } = this.props;
      return <WrappedComponent {...rest} {...this.context} ref={forwardRef} />;
    }
  }

  GenericContextHOC.displayName = `${hocDisplayNamePrefix
    || 'GenericContextHOC'}(${WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component'})`;

  hoistNonReactStatic(GenericContextHOC, WrappedComponent);

  return React.forwardRef((props, ref) => (
    <GenericContextHOC {...props} forwardRef={ref} />
  ));
};

export default contextHoc;
