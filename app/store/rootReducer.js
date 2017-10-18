// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { combineEpics } from 'redux-observable';
import audioReducer, { audioEpics } from '../reducers/audioActionReducer';
import playListReducer from '../reducers/playListActionReducer';

export const rootEpic = combineEpics(audioEpics);

const rootReducer = combineReducers({
  router,
  audioChunk: audioReducer,
  playListChunk: playListReducer,
});

export default rootReducer;
