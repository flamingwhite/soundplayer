import React, { Component } from 'react';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/observable/fromEvent';

class Scroller extends Component {
  componentDidMount() {
    const { doOneCheck, doRecursiveCheck, elm } = this;
    const { checkOnResize = true } = this.props;

    this.check$
      .filter(this.shouldLoadMore)
      .debounceTime(20)
      .startWith(1)
      .exhaustMap(recur => Promise.all([recur, this.props.loadMore()]))
      .map(arr => arr[0])
      .subscribe(recur => {
        console.log('recur', recur);
        if (recur) this.doRecursiveCheck();
      });

    if (checkOnResize) {
      Observable.fromEvent(window, 'resize').subscribe(doRecursiveCheck);
    }

    const scrollDown$ = Observable.fromEvent(elm, 'scroll')
      .map(() => elm.scrollTop)
      .pairwise()
      .filter(x => x[1] > x[0]);

    const mousewheel$ = Observable.fromEvent(elm, 'mousewheel').filter(
      e => (e.originalEvent || e).deltaY >= 0,
    );

    mousewheel$.merge(scrollDown$).subscribe(doOneCheck);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checkOnValueChange != this.props.checkOnValueChange) {
      setTimeout(this.doRecursiveCheck);
    }
  }

  componentWillUnmount() {
    this.willUnmount$.next('unmount');
    this.willUnmount$.complete();
  }

  willUnmount$ = new Subject();
  check$ = new Subject().takeUntil(this.willUnmount$);

  doOneCheck = () => this.check$.next(0);
  doRecursiveCheck = () => this.check$.next(1);

  shouldLoadMore = () => {
    const { distanceToBottom = 0, hasMore } = this.props;
    const { elm } = this;
    return hasMore && elm.scrollHeight - elm.scrollTop - elm.clientHeight <= distanceToBottom;
  };

  render() {
    const { children } = this.props;
    return (
      <div
        ref={elm => (this.elm = elm)}
        style={{
          height: '100%',
          overflow: 'auto',
        }}
      >
        {children}
      </div>
    );
  }
}

export default Scroller;
