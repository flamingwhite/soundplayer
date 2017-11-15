import * as R from 'ramda';

export const actionCreator = R.curry(
  (type, payload) => (R.isNil(payload) ? { type } : { type, payload }),
);
