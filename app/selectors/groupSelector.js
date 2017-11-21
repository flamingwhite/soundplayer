import * as R from 'ramda';

export const groupListSelector = state =>
  R.toPairs(state.groupChunk.groupSet).map(([id, v]) => ({ id, ...v }));

export const groupListForDropdownSelector = state =>
  R.toPairs(state.groupChunk.groupSet)
    .map(([id, v]) => ({ id, ...v }))
    .filter(a => !a.hideInDropdown);

export const activeGroupSelector = state => {
  const { groupChunk } = state;
  const { activeGroup } = groupChunk;
  return R.path(['groupSet', activeGroup])(groupChunk);
};
