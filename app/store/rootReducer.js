// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { combineEpics } from 'redux-observable';
import audioReducer, { audioEpics } from '../reducers/audioActionReducer';
import groupReducer, { groupEpics } from '../reducers/groupActionReducer';
import appStateReducer from '../reducers/appStateActionReducer';

export const rootEpic = combineEpics(audioEpics, groupEpics);

const rootReducer = combineReducers({
  router,
  audioChunk: audioReducer,
  groupChunk: groupReducer,
  appStateChunk: appStateReducer,
});

export default rootReducer;
