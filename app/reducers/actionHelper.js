import * as R from 'ramda';

export const actionCreator = R.curry((type, payload) => (payload ? { type, payload } : { type }));
