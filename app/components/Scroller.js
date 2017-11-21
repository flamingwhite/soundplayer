import React, { Component } from 'react';
import Rx from 'rxjs/Rx';
import * as R from 'ramda';
import lifecycleStream from '../hoc/lifecycleStream';

class Scroller extends Component {
  componentDidMount() {
    const { loadMore, willUnmount$ } = this.props;

    const scrollDown$ = Rx.Observable
      .fromEvent(this.elm, 'scroll')
      .map(() => $(this.elm).scrollTop())
      .pairwise()
      .filter(x => x[1] > x[0])
      .map(x => x[1])
      .filter(() => $(this.btmElm).position().top <= $(this.elm).height());

    const mousewheel$ = Rx.Observable
      .fromEvent(this.elm, 'mousewheel')
      .filter(e => e.deltaY >= 0 && $(this.btmElm).position().top <= $(this.elm).height())
      .debounceTime(50);

    scrollDown$
      .merge(mousewheel$)
      .takeUntil(willUnmount$)
      .filter(() => this.props.hasMore)
      .subscribe(() => {
        console.log($(this.btmElm).position().top, $(this.elm).height());
        loadMore();
        console.log('time to reload          ----------');
      });
  }

  render() {
    const { children } = this.props;
    console.log('children', children);

    const { hadMore, loadMore } = this.props;

    return (
      <div
        ref={elm => (this.elm = elm)}
        className="sky vbox"
        style={{
          position: 'relative',
          flex: 1,
          overflow: 'auto',
        }}
      >
        <div>{children}</div>
        <div ref={btmElm => (this.btmElm = btmElm)} style={{ border: '1px solid red' }} />
      </div>
    );
  }
}

export default R.compose(lifecycleStream)(Scroller);
