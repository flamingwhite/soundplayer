import * as R from 'ramda';
import { combineEpics } from 'redux-observable';
import createUUID from '../utils/createUUID';
import { actionCreator } from './actionHelper';
import { SET_CURRENT_PLAYING } from './audioActionReducer';
import { getMd5 } from '../utils/getLocalFiles';

// const initialState = {
//   groups: [],
//   activeGroup: { type: 'default', id: 'all' },
//   currentPlayingGroup: { type: 'default', id: 'all' },
// };

const initialState = {
  groupSet: {
    all: {
      type: 'default',
      name: 'All',
    },
    favorite: {
      type: 'default',
      name: 'Favorites',
    },
  },
  activeGroup: 'all',
  currentPlayingGroup: 'all',
};

export const ADD_GROUP = 'ADD_GROUP';
export const REMOVE_GROUP = 'REMOVE_GROUP';
export const SET_GROUP_ACTIVE = 'SET_GROUP_ACTIVE';
export const SET_CURRENT_PLAYING_GROUP = 'SET_CURRENT_PLAYING_GROUP';

export const actions = {
  addGroup: actionCreator(ADD_GROUP),
  removeGroup: () => actionCreator(REMOVE_GROUP, null),
  setActiveGroup: actionCreator(SET_GROUP_ACTIVE),
  setCurrentPlayingGroup: actionCreator(SET_CURRENT_PLAYING_GROUP),
};

const actionHandler = {
  [ADD_GROUP]: (state, { payload }) =>
    R.evolve({
      groupSet: R.assoc(getMd5(payload.name), {
        type: 'custom',
        name: payload.name,
      }),
    })(state),
  [REMOVE_GROUP]: (state, { payload }) =>
    R.evolve({
      groupSet: R.dissoc(payload.groupId),
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
