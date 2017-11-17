import React, { Component } from 'react';
import Rx from 'rxjs/Rx';
import { setTimeout } from 'timers';

class Scroller extends Component {
  componentDidMount() {
    const { loadMore } = this.props;
    this.scrollTop$ = Rx.Observable
      .fromEvent(this.elm, 'scroll')
      //   .throttleTime(150)
      .map(() => $(this.elm).scrollTop())
      //   .pairwise()
      //   .filter(x => x[1] > x[0])
      //   .map(x => x[1])
      .filter(() => $(this.btmElm).position().top <= $(this.elm).height() + 10);
    //   .debounceTime(200);

    this.scrollTop$
      //   .exhaustMap(() => Promise.resolve(loadMore()))
      .subscribe(x => {
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
        className="sky"
        style={{ border: '1px solid red', height: '100%', overflow: 'auto', position: 'relative' }}
      >
        <div
          style={{ border: '1px solid green', marginTop: 3 }}
          ref={topElm => (this.topElm = topElm)}
        />
        {children}
        <div
          style={{ border: '1px solid black', marginBottom: 3 }}
          ref={btmElm => (this.btmElm = btmElm)}
        />
      </div>
    );
  }
}

export default Scroller;

/*

        style={{ height: '100%', border: '1px solid red', overflow: 'auto' }}
*/
