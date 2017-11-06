import * as R from 'ramda';

export const groupListSelector = state =>
  R.toPairs(state.groupChunk.groupSet).map(([id, v]) => ({ id, ...v }));
