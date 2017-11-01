import Rx from 'rxjs/Rx';
import * as R from 'ramda';

export const event$ = new Rx.Subject();
export const eventOfType$ = type => event$.filter(R.propEq('type', type)).map(R.prop('payload'));
export const publishEvent = (type, payload) => event$.next({ type, payload });
