import * as R from 'ramda';
import { combineEpics } from 'redux-observable';
import { getAudioTags, getDuration } from '../utils/audioUtil';

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
export const UPDATE_AUDIO_INFO = 'UPDATE_AUDIO_INFO';
export const REMOVE_AUDIO = 'REMOVE_AUDIO';
export const REMOVE_ALL_AUDIO = 'REMOVE_ALL_AUDIO';
export const SET_CURRENT_PLAYING = 'SET_CURRENT_PLAYING';
export const SET_PLAY_MODE = 'SET_PLAY_MODE';
export const PLAYBACK_END = 'PLAYBACK_END';
export const SET_LIKE_AUDIO = 'SET_LIKE_AUDIO';

const addAudio = audio => ({
  type: ADD_AUDIO,
  payload: audio,
});

const updateAudioInfo = info => ({
  type: UPDATE_AUDIO_INFO,
  payload: info,
});

const removeAudio = audioPath => ({
  type: REMOVE_AUDIO,
  payload: audioPath,
});

const removeAllAudio = audioPath => ({
  type: REMOVE_ALL_AUDIO,
  payload: audioPath,
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

const setLikeAudio = (path, like = true) => ({
  type: SET_LIKE_AUDIO,
  payload: { path, like },
});

export const actions = {
  addAudio,
  updateAudioInfo,
  removeAudio,
  removeAllAudio,
  setCurrentPlaying,
  setPlayMode,
  playbackEnd,
  setLikeAudio,
};

const getNextSong = (list, currentPlaying, mode = 'repeat') => {
  console.log('get into ended');
  const index = list.map(R.prop('path')).indexOf(R.prop('path', currentPlaying));
  console.log('current index is ', index);
  return list[index === list.length - 1 ? 0 : index + 1];
};

const actionHandler = {
  [ADD_AUDIO]: (state, { payload }) =>
    R.evolve({
      audios: R.unless(R.any(R.propEq('path', payload.path)), R.append(payload)),
    })(state),
  [UPDATE_AUDIO_INFO]: (state, { payload }) =>
    R.evolve({
      audios: R.map(au => (au.path === payload.path ? { ...au, ...payload } : au)),
    })(state),
  [REMOVE_AUDIO]: (state, { payload }) =>
    R.evolve({
      audios: R.filter(R.complement(R.propEq)('path', payload)),
    })(state),
  [REMOVE_ALL_AUDIO]: R.pipe(R.assoc('audios', []), R.assoc('currentPlaying', null)),
  [SET_CURRENT_PLAYING]: (state, { payload }) => R.assoc('currentPlaying', payload, state),
  [SET_PLAY_MODE]: (state, { payload }) => R.assoc('playModeId', payload, state),
  [PLAYBACK_END]: state =>
    R.assoc(
      'currentPlaying',
      getNextSong(state.audios, state.currentPlaying, state.playModeId),
      state,
    ),
  [SET_LIKE_AUDIO]: (state, { payload }) =>
    R.evolve({
      audios: R.map(R.when(R.propEq('path', payload.path), R.assoc('liked', payload.like))),
    })(state),
};

const audioReducer = (state = initialState, action) => {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
};

// Test some Epics
// const fetchAudioInfoEpic = action$ =>
//   action$
//     .ofType(ADD_AUDIO)
//     .map(R.path(['payload', 'path']))
//     .flatMap(getAudioTags)
//     .map(tags => {
//       const { path, title, album, artist, year } = tags;
//       const { track } = tags.v1;
//       return { path, title, album, artist, year, track };
//     })
//     .map(updateAudioInfo);

const fetchAudioInfoEpic = actions$ =>
  actions$
    .ofType(ADD_AUDIO)
    .map(R.prop('payload'))
    // .map(payload => R.propSatisfies(R.contains(' - '), 'name'))
    .flatMap(payload => {
      const splitter = ' - ';
      if (R.propSatisfies(R.contains(splitter), 'name')(payload)) {
        const [artist, title] = payload.name.split(splitter);
        return Promise.resolve({
          ...payload,
          artist,
          title,
        });
      }
      return getAudioTags(payload.path).then(tags => {
        const { path, title, album, artist, year } = tags;
        const { track } = tags.v1;
        return { path, title, album, artist, year, track };
      });
    })
    .map(updateAudioInfo);

// const getAudioDurationEpic = action$ =>
//   action$
//     .ofType(ADD_AUDIO)
//     .map(R.path(['payload', 'path']))
//     .flatMap(path => Promise.all([path, getDuration(path)]))
//     .map(([path, duration]) => ({
//       path,
//       duration,
//     }))
//     .map(updateAudioInfo);

export const audioEpics = combineEpics(fetchAudioInfoEpic);

export default audioReducer;
