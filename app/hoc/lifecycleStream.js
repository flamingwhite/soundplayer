import React, { Component } from 'react';
import Rx from 'rxjs/Rx';

const CONSTRUCTOR = 'CONSTRUCTOR';
const DID_MOUNT = 'DID_MOUNT';
const WILL_UNMOUNT = 'WILL_UNMOUNT';

export default InnerCmp => {
  const lifecycle$ = new Rx.Subject();
  const willUnmount$ = lifecycle$.filter(x => x === WILL_UNMOUNT);
  const didMount$ = lifecycle$.filter(x => x === DID_MOUNT);
  const constructor$ = lifecycle$.filter(x => x === CONSTRUCTOR);

  return class Wrapper extends Component {
    constructor() {
      super();
      lifecycle$.next(CONSTRUCTOR);
    }
    componentDidMount() {
      lifecycle$.next(DID_MOUNT);
    }
    componentWillUnmount() {
      lifecycle$.next(WILL_UNMOUNT);
      lifecycle$.complete();
    }

    render() {
      return (
        <InnerCmp {...this.props} {...{ willUnmount$, didMount$, constructor$, lifecycle$ }} />
      );
    }
  };
};
