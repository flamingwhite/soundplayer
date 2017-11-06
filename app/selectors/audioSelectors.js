import * as R from 'ramda';
import { randomItem } from '../utils/dataUtil';

const getAudiosByGroup = (state, group) => {
  const { audioChunk } = state;
  const { audios = [] } = audioChunk;
  const { type, id } = group;

  if (type === 'custom') {
  } else if (id === 'favorite') {
    return audios.filter(au => au.liked);
  } else return audios;
};

export const getActiveGroupAudios = state => getAudiosByGroup(state, state.groupChunk.activeGroup);

export const getCurrentPlayingGroupAudios = state =>
  getAudiosByGroup(state, state.groupChunk.currentPlayingGroup);

export const getNextAudioToPlay = state => {
  const audioList = getCurrentPlayingGroupAudios(state);
  const currentPlaying = state.audioChunk.currentPlaying;
  const index = R.findIndex(R.propEq('path', currentPlaying.path), audioList);
  return audioList[index === audioList.length - 1 ? 0 : index + 1];
};

export const nextAudioToPlay = (audios, currentPlaying, playMode = 'seq') => {
  if (playMode === 'repeat') return currentPlaying;
  if (audios.length === 1) return currentPlaying;
  if (playMode === 'random') return randomItem(audios);
  const index = R.findIndex(R.propEq('id', currentPlaying.id), audios);
  return audios[index === audios.length - 1 ? 0 : index + 1];
};

export const onlineAudios = state =>
  R.filter(R.pathEq(['groups', 'onlineDownload'], true))(state.audioChunk.audios);

export const favoriteAudios = state =>
  R.filter(R.pathEq(['groups', 'favorite'], true))(state.audioChunk.audios);

export const visibleAudios = state => {
  const { audioChunk, groupChunk } = state;
  const { activeGroup } = groupChunk;
  const { audios } = audioChunk;
  return R.filter(
    R.either(R.always(activeGroup === 'all'), R.pathEq(['groups', activeGroup], true)),
    audios,
  );
};
