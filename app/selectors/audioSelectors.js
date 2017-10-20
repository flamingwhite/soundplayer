import * as R from 'ramda';

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
