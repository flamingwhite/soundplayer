import * as R from 'ramda';
import { combineEpics } from 'redux-observable';
import createUUID from '../utils/createUUID';
import { actionCreator } from './actionHelper';
import { SET_CURRENT_PLAYING } from './audioActionReducer';

const initialState = {
  groups: [],
  activeGroup: { type: 'default', id: 'all' },
  currentPlayingGroup: { type: 'default', id: 'all' },
};

export const ADD_GROUP = 'ADD_GROUP';
export const REMOVE_GROUP = 'REMOVE_GROUP';
export const SET_GROUP_ACTIVE = 'SET_GROUP_ACTIVE';
export const SET_CURRENT_PLAYING_GROUP = 'SET_CURRENT_PLAYING_GROUP';

export const actions = {
  addGroup: actionCreator(ADD_GROUP),
  removeGroup: actionCreator(REMOVE_GROUP),
  setActiveGroup: actionCreator(SET_GROUP_ACTIVE),
  setCurrentPlayingGroup: actionCreator(SET_CURRENT_PLAYING_GROUP),
};

const actionHandler = {
  [ADD_GROUP]: (state, { payload }) =>
    R.evolve({
      groups: R.append({ id: createUUID(), name: payload }),
    })(state),
  [REMOVE_GROUP]: (state, { payload }) =>
    R.evolve({
      groups: R.reject(R.propEq('id', payload)),
    })(state),
  [SET_GROUP_ACTIVE]: (state, { payload }) => R.assoc('activeGroup', payload, state),
  [SET_CURRENT_PLAYING_GROUP]: (state, { payload }) =>
    R.assoc('currentPlayingGroup', payload, state),
};

const groupReducer = (state = initialState, action) => {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
};

const setCurrentPlayingAudioGroupEpic = (action$, store) =>
  action$
    .ofType(SET_CURRENT_PLAYING)
    .map(() => store.getState().groupChunk.activeGroup)
    .map(actions.setCurrentPlayingGroup);

export const groupEpics = combineEpics(setCurrentPlayingAudioGroupEpic);

export default groupReducer;
