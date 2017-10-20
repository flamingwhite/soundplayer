// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { combineEpics } from 'redux-observable';
import audioReducer, { audioEpics } from '../reducers/audioActionReducer';
import playlistReducer from '../reducers/playListActionReducer';
import appStateReducer from '../reducers/appStateActionReducer';

export const rootEpic = combineEpics(audioEpics);

const rootReducer = combineReducers({
  router,
  audioChunk: audioReducer,
  playlistChunk: playlistReducer,
  appStateChunk: appStateReducer,
});

export default rootReducer;
