import * as R from 'ramda';

const initialState = {
  audios: [],
  currentPlaying: null,
  playModeId: 'repeat',
};

export const playModes = [
  {
    id: 'repeat',
    label: 'Repeat',
  },
  {
    id: 'random',
    label: 'random',
  },
];

export const ADD_AUDIO = 'ADD_AUDIO';
export const REMOVE_AUDIO = 'REMOVE_AUDIO';
export const SET_CURRENT_PLAYING = 'SET_CURRENT_PLAYING';
export const SET_PLAY_MODE = 'SET_PLAY_MODE';
export const PLAYBACK_END = 'PLAYBACK_END';

const addAudio = audio => ({
  type: ADD_AUDIO,
  payload: audio,
});

const setCurrentPlaying = audio => ({
  type: SET_CURRENT_PLAYING,
  payload: audio,
});

const setPlayMode = modeId => ({
  type: SET_PLAY_MODE,
  payload: modeId,
});

const playbackEnd = () => ({
  type: PLAYBACK_END,
});

export const actions = {
  addAudio,
  setCurrentPlaying,
  setPlayMode,
  playbackEnd,
};

const getNextSong = (list, currentPlaying, mode = 'repeat') => {
  console.log('get into ended');
  const index = list.map(R.prop('path')).indexOf(R.prop('path', currentPlaying));
  console.log('current index is ', index);
  return list[index === list.length - 1 ? 0 : index + 1];
};

const actionHandler = {
  [ADD_AUDIO]: (state, action) => ({
    ...state,
    audios: state.audios.find(au => au.path === action.payload.path)
      ? state.audios
      : [...state.audios, action.payload],
  }),
  [SET_CURRENT_PLAYING]: (state, action) => ({
    ...state,
    currentPlaying: action.payload,
  }),
  [SET_PLAY_MODE]: (state, action) => ({
    ...state,
    playModeId: action.payload,
  }),
  [PLAYBACK_END]: state => ({
    ...state,
    currentPlaying: getNextSong(state.audios, state.currentPlaying, state.playModeId),
  }),
};

const audioReducer = (state = initialState, action) => {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default audioReducer;
