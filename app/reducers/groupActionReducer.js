import Rx from 'rxjs/Rx';
import * as R from 'ramda';
import { combineEpics } from 'redux-observable';
import { actionCreator } from './actionHelper';
import { SET_CURRENT_PLAYING } from './audioActionReducer';
import { getMd5 } from '../utils/idUtil';

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
    onlineDownload: {
      type: 'default',
      name: 'Online Download',
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
  removeGroup: actionCreator(REMOVE_GROUP),
  setActiveGroup: actionCreator(SET_GROUP_ACTIVE),
  setCurrentPlayingGroup: actionCreator(SET_CURRENT_PLAYING_GROUP),
};

const REMOVE_GROUP_PRIVATE = 'REMOVE_GROUP_PRIVATE';
const removeGroupPrivate = actionCreator(REMOVE_GROUP_PRIVATE);

const actionHandler = {
  [ADD_GROUP]: (state, { payload }) =>
    R.evolve({
      groupSet: R.assoc(getMd5(payload), {
        type: 'custom',
        name: payload,
      }),
    })(state),
  [REMOVE_GROUP_PRIVATE]: (state, { payload }) =>
    R.evolve({
      groupSet: R.dissoc(payload),
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

const removeGroupEpic = (action$, store) =>
  action$
    .ofType(REMOVE_GROUP)
    .pluck('payload')
    .filter(groupId =>
      R.pathEq(['groupChunk', 'groupSet', groupId, 'type'], 'custom', store.getState()),
    )
    .flatMap(groupId => {
      const activeGroup = R.path(['groupChunk', 'activeGroup'], store.getState());
      const currentPlayingGroup = R.path(['groupChunk', 'currentPlayingGroup'], store.getState());

      console.log('gorupi', groupId, activeGroup, currentPlayingGroup);
      const actionList = [removeGroupPrivate(groupId)];
      if (groupId === activeGroup) actionList.push(actions.setActiveGroup('all'));
      if (groupId === currentPlayingGroup) actionList.push(actions.setCurrentPlayingGroup('all'));
      return actionList;
    });

export const groupEpics = combineEpics(setCurrentPlayingAudioGroupEpic, removeGroupEpic);

export default groupReducer;
