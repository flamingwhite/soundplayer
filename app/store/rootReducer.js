// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import audioReducer from '../reducers/audioActionReducer';
import playListReducer from '../reducers/playListActionReducer';

const rootReducer = combineReducers({
  router,
  audioChunk: audioReducer,
  playListChunk: playListReducer,
});

export default rootReducer;
