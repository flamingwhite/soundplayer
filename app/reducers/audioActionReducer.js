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

export const ADD_MULTIPLE_AUDIOS = 'ADD_MULTIPLE_AUDIOS';
export const UPDATE_AUDIO_INFO = 'UPDATE_AUDIO_INFO';
export const UPDATE_MULTIPLE_AUDIO_INFO = 'UPDATE_MULTIPLE_AUDIO_INFO';
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

const addMultipleAudios = audios => ({
  type: ADD_MULTIPLE_AUDIOS,
  payload: audios,
});

const updateAudioInfo = info => ({
  type: UPDATE_AUDIO_INFO,
  payload: info,
});

const updateMultipleAudioInfo = list => ({
  type: UPDATE_MULTIPLE_AUDIO_INFO,
  payload: list,
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
  addMultipleAudios,
  updateAudioInfo,
  updateMultipleAudioInfo,
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
  [ADD_MULTIPLE_AUDIOS]: (state, { payload }) =>
    R.evolve({
      audios: R.unionWith(R.eqProps('path'), R.__, payload),
    })(state),
  [UPDATE_AUDIO_INFO]: (state, { payload }) =>
    R.evolve({
      audios: R.map(au => (au.path === payload.path ? { ...au, ...payload } : au)),
    })(state),
  [UPDATE_MULTIPLE_AUDIO_INFO]: (state, { payload }) =>
    R.evolve({
      audios: R.map(au => {
        const find = R.find(R.propEq('path', au.path), payload);
        return find ? { ...au, ...find } : au;
      }),
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

const getAudioInfoPromise = audioObj => {
  const splitter = ' - ';
  if (R.propSatisfies(R.contains(splitter), 'name')(audioObj)) {
    const [artist, title] = audioObj.name.split(splitter);
    return Promise.resolve({
      ...audioObj,
      artist,
      title,
    });
  }
  return getAudioTags(audioObj.path).then(tags => {
    const { path, title, album, artist, year } = tags;
    const { track } = tags.v1;
    return { path, title, album, artist, year, track };
  });
};

const fetchAudioInfoEpic = actions$ =>
  actions$
    .ofType(ADD_AUDIO)
    .map(R.prop('payload'))
    .flatMap(getAudioInfoPromise)
    .map(updateAudioInfo);

const fetchMultipleAudioInfoEpic = action$ =>
  action$
    .ofType(ADD_MULTIPLE_AUDIOS)
    .map(R.prop('payload'))
    .map(R.map(getAudioInfoPromise))
    .flatMap(ps => Promise.all(ps))
    .map(updateMultipleAudioInfo);

export const audioEpics = combineEpics(fetchAudioInfoEpic, fetchMultipleAudioInfoEpic);

export default audioReducer;
