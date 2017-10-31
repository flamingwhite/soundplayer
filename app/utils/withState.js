import React, { Component } from 'react';
import Rx from 'rxjs/Rx';
import * as R from 'ramda';

export const withState = (initState, functionOb) => InnerCmp => {
  const state$ = new Rx.Subject().scan((acc, value) => value(acc), initState);

  const newProps = Object.keys(functionOb).reduce((acc, cur) => {
    const tempFn = (...a) => b => functionOb[cur](b)(...a);
    return {
      ...acc,
      [cur]: (...v) => state$.next(tempFn(...v)),
    };
  }, {});

  console.log(newProps);
  const changeState = fn => state$.next(fn);

  return class Wrapper extends Component {
    componentWillMount() {
      state$.startWith(initState).subscribe(s => {
        console.log('state emit', s);
        this.setState(s);
      });
    }
    render() {
      return <InnerCmp {...this.props} {...this.state} {...newProps} changeState={changeState} />;
    }
  };
};
