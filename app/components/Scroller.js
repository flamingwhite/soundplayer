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
      .pairwise()
      .filter(x => x[1] > x[0])
      .map(x => x[1])
      .filter(() => $(this.btmElm).position().top <= $(this.elm).height());
    //   .debounceTime(200);

    this.scrollTop$
      //   .exhaustMap(() => Promise.resolve(loadMore()))
      .subscribe(x => {
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
          border: '1px solid red',
          overflow: 'scroll',
          position: 'relative',
          flex: 1,
        }}
      >
        <div className="box">{children}</div>
        <div ref={btmElm => (this.btmElm = btmElm)} />
      </div>
    );
  }
}

export default Scroller;

/*

        style={{ height: '100%', border: '1px solid red', overflow: 'auto' }}
*/
