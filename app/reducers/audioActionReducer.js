import * as R from 'ramda';
import { combineEpics } from 'redux-observable';
import { getAudioTags } from '../utils/audioUtil';
import { actionCreator } from './actionHelper';
import { getNextAudioToPlay, nextAudioToPlay } from '../selectors/audioSelectors';
import { getMd5 } from '../utils/getLocalFiles';
import { getNameByPath } from '../utils/audioUtil';

const initialState = {
  audios: [],
  volume: 1,
  currentPlaying: null,
  playModeId: 'repeat',
  history: [],
  historyIndex: 0,
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

export const SET_VOLUME = 'SET_VOLUME';
export const ADD_AUDIO = 'ADD_AUDIO';
export const ADD_AUDIO_BY_PATH = 'ADD_AUDIO_BY_PATH';
export const ADD_MULTIPLE_AUDIOS = 'ADD_MULTIPLE_AUDIOS';
export const UPDATE_AUDIO_INFO = 'UPDATE_AUDIO_INFO';
export const ADD_AUDIO_TO_GROUP = 'ADD_AUDIO_TO_GROUP';
export const SET_AUDIO_GROUPS = 'SET_AUDIO_GROUPS';
export const REMOVE_AUDIO_FROM_GROUP = 'REMOVE_AUDIO_FROM_GROUP';
export const UPDATE_MULTIPLE_AUDIO_INFO = 'UPDATE_MULTIPLE_AUDIO_INFO';
export const REMOVE_AUDIO = 'REMOVE_AUDIO';
export const REMOVE_ALL_AUDIO = 'REMOVE_ALL_AUDIO';
export const SET_CURRENT_PLAYING = 'SET_CURRENT_PLAYING';
export const SET_PLAY_MODE = 'SET_PLAY_MODE';
export const PLAYBACK_END = 'PLAYBACK_END';
export const PLAY_NEXT_AUDIO = 'PLAY_NEXT_AUDIO';
export const PLAY_PREVIOUS_AUDIO = 'PLAY_PREVIOUS_AUDIO';
export const ADD_AUDIO_TO_FAVORITE = 'ADD_AUDIO_TO_FAVORITE';
export const REMOVE_AUDIO_FROM_FAVORITE = 'REMOVE_AUDIO_FROM_FAVORITE';
export const ADD_HISTORY = 'ADD_HISTORY';
export const POP_HISTORY = 'POP_HISTORY';
export const MEDIA_DOWNLOADED = 'MEDIA_DOWNLOADED';

export const actions = {
  setVolume: actionCreator(SET_VOLUME),
  addAudio: actionCreator(ADD_AUDIO),
  addAudioByPath: actionCreator(ADD_AUDIO_BY_PATH),
  addMultipleAudios: actionCreator(ADD_MULTIPLE_AUDIOS),
  updateAudioInfo: actionCreator(UPDATE_AUDIO_INFO),
  updateMultipleAudioInfo: actionCreator(UPDATE_MULTIPLE_AUDIO_INFO),
  addAudioToGroup: actionCreator(ADD_AUDIO_TO_GROUP),
  removeAudioFromGroup: actionCreator(REMOVE_AUDIO_FROM_GROUP),
  setAudioGroups: actionCreator(SET_AUDIO_GROUPS),
  removeAudio: actionCreator(REMOVE_AUDIO),
  removeAllAudio: () => actionCreator(REMOVE_ALL_AUDIO, null),
  setCurrentPlaying: actionCreator(SET_CURRENT_PLAYING),
  setPlayMode: actionCreator(SET_PLAY_MODE),
  playbackEnd: () => actionCreator(PLAYBACK_END, null),
  playNextAudio: () => actionCreator(PLAY_NEXT_AUDIO, null),
  playPreviousAudio: () => actionCreator(PLAY_PREVIOUS_AUDIO, null),
  //   setLikeAudio: (id, like = true) => actionCreator(SET_LIKE_AUDIO, { id, like }),
  addAudioToFavorite: actionCreator(ADD_AUDIO_TO_FAVORITE),
  removeAudioFromFavorite: actionCreator(REMOVE_AUDIO_FROM_FAVORITE),
  addHistory: actionCreator(ADD_HISTORY),
  popHistory: actionCreator(POP_HISTORY),
  mediaDownloaded: actionCreator(MEDIA_DOWNLOADED),
};

const actionHandler = {
  [SET_VOLUME]: (state, { payload }) => R.assoc('volume', payload, state),
  [ADD_AUDIO]: (state, { payload }) =>
    R.evolve({
      audios: R.unionWith(R.eqProps('id'), R.__, [payload]),
    })(state),
  [ADD_MULTIPLE_AUDIOS]: (state, { payload }) =>
    R.evolve({
      audios: R.unionWith(R.eqProps('id'), R.__, payload),
    })(state),
  [UPDATE_AUDIO_INFO]: (state, { payload }) =>
    R.evolve({
      audios: R.map(au => (au.id === payload.id ? { ...au, ...payload } : au)),
    })(state),
  [UPDATE_MULTIPLE_AUDIO_INFO]: (state, { payload }) =>
    R.evolve({
      audios: R.map(au => {
        const find = R.find(R.propEq('id', au.id), payload);
        return find ? { ...au, ...find } : au;
      }),
    })(state),
  [ADD_AUDIO_TO_GROUP]: (state, { payload }) =>
    R.evolve({
      audios: R.map(
        R.when(R.propEq('id', payload.audioId), R.assocPath(['groups', payload.groupId], true)),
      ),
    })(state),
  [REMOVE_AUDIO_FROM_GROUP]: (state, { payload }) =>
    R.evolve({
      audios: R.when(R.propEq('id', payload.audioId), R.dissocPath(['groups', payload.groupId])),
    })(state),
  [SET_AUDIO_GROUPS]: (state, { payload }) =>
    R.evolve({
      audios: R.map(R.when(R.propEq('id', payload.audioId)), R.assoc('groups', payload.groupIds)),
    })(state),
  [REMOVE_AUDIO]: (state, { payload }) =>
    R.evolve({
      audios: R.reject(R.propEq('id', payload)),
    })(state),
  [REMOVE_ALL_AUDIO]: R.pipe(R.assoc('audios', []), R.assoc('currentPlaying', null)),
  [SET_CURRENT_PLAYING]: (state, { payload }) => R.assoc('currentPlaying', payload, state),
  [SET_PLAY_MODE]: (state, { payload }) => R.assoc('playModeId', payload, state),
  [ADD_AUDIO_TO_FAVORITE]: (state, { payload }) =>
    R.evolve({
      audios: R.map(R.when(R.propEq('id', payload), R.assocPath(['groups', 'favorite'], true))),
    })(state),
  [REMOVE_AUDIO_FROM_FAVORITE]: (state, { payload }) =>
    R.evolve({
      audios: R.map(R.when(R.propEq('id', payload), R.dissocPath(['groups', 'favorite']))),
    })(state),
  [ADD_HISTORY]: (state, { payload }) =>
    R.evolve({
      history: history => [...R.reject(R.propEq('id', payload.id), history), payload],
    })(state),
  [POP_HISTORY]: state =>
    R.evolve({
      history: R.dropLast,
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

const addAduioByPathEpic = action$ =>
  action$
    .ofType(ADD_AUDIO_BY_PATH)
    .pluck('payload')
    .map(path => ({
      id: getMd5(path),
      path,
      name: getNameByPath(path),
    }))
    .map(actions.addAudio);

const fetchAudioInfoEpic = actions$ =>
  actions$
    .ofType(ADD_AUDIO)
    .pluck('payload')
    .flatMap(getAudioInfoPromise)
    .map(actions.updateAudioInfo);

const fetchMultipleAudioInfoEpic = action$ =>
  action$
    .ofType(ADD_MULTIPLE_AUDIOS)
    .pluck('payload')
    .map(R.map(getAudioInfoPromise))
    .flatMap(ps => Promise.all(ps))
    .map(actions.updateMultipleAudioInfo);

// const playNextAudioEpic = (action$, store) =>
//   action$
//     .filter(action => [PLAYBACK_END, PLAY_NEXT_AUDIO].includes(action.type))
//     .map(() => getNextAudioToPlay(store.getState()))
//     .map(actions.setCurrentPlaying);

const playPreviousAudioEpic = (action$, store) =>
  action$
    .ofType(PLAY_PREVIOUS_AUDIO)
    .map(() => R.nth(-2, store.getState().audioChunk.history))
    .flatMap(audio => [actions.popHistory(), actions.setCurrentPlaying(audio)]);

const addPlayingHistory = action$ =>
  action$
    .ofType(SET_CURRENT_PLAYING)
    .pluck('payload')
    .map(actions.addHistory);

const nextAudioEpic = (action$, store) =>
  action$
    .filter(action => [PLAYBACK_END, PLAY_NEXT_AUDIO].includes(action.type))
    .filter(() => store.getState().audioChunk.historyIndex === 0)
    .pluck('payload')
    .map(() =>
      nextAudioToPlay(
        store.getState().audioChunk.audios,
        store.getState().audioChunk.currentPlaying,
      ),
    )
    .map(actions.setCurrentPlaying);

const downloadOnlineMediaEpic = action$ =>
  action$
    .ofType(MEDIA_DOWNLOADED)
    .pluck('payload')
    .map(audio => R.assoc('id', getMd5(audio.path), audio))
    .flatMap(audio => [
      actions.addAudio(audio),
      actions.addAudioToGroup({ audioId: audio.id, groupId: 'onlineDownload' }),
    ]);

export const audioEpics = combineEpics(
  addAduioByPathEpic,
  fetchAudioInfoEpic,
  fetchMultipleAudioInfoEpic,
  playPreviousAudioEpic,
  addPlayingHistory,
  nextAudioEpic,
  downloadOnlineMediaEpic,
);

export default audioReducer;
