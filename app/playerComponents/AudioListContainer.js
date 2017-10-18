import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { localAudioPaths, openItemInFolder } from '../utils/getLocalFiles';
import { getNameByPath } from '../utils/audioUtil';
import { actions } from '../reducers/audioActionReducer';

const formatSec = sec => `${Math.floor(sec / 60)}:${sec % 60}`;

const AudioItem = props => {
  const { onAudioClick, audio, openInFolderClick, removeAudio } = props;

  return (
    <div style={{ padding: 4 }}>
      <span>{formatSec(audio.duration)}</span>
      <span onClick={() => onAudioClick(audio)}>{audio.name}</span>
      <span onClick={() => openInFolderClick(audio)}> Open IN Finder</span>
      <span onClick={() => removeAudio(audio)}> Remove AUdio</span>
    </div>
  );
};

class AudioListContainer extends React.Component {
  addAudios = () => {
    const { addAudio } = this.props;
    return localAudioPaths().then(paths =>
      paths
        .map(p => ({
          path: p,
          name: getNameByPath(p),
        }))
        .forEach(addAudio),
    );
  };

  render() {
    const { audios, setCurrentPlayingAudio, removeAudio, removeAllAudio } = this.props;
    return (
      <div>
        {audios.map(au => (
          <AudioItem
            audio={au}
            onAudioClick={setCurrentPlayingAudio}
            openInFolderClick={audio => openItemInFolder(audio.path)}
            removeAudio={removeAudio}
          />
        ))}
        <Button onClick={this.addAudios}>Add Audio</Button>
        <Button onClick={removeAllAudio}>Remove ALL</Button>
      </div>
    );
  }
}

export default connect(
  state => ({
    audios: state.audioChunk.audios,
  }),
  dispatch => ({
    addAudio: audio => dispatch(actions.addAudio(audio)),
    removeAudio: audio => dispatch(actions.removeAudio(audio.path)),
    removeAllAudio: () => dispatch(actions.removeAllAudio()),
    setCurrentPlayingAudio: audio => dispatch(actions.setCurrentPlaying(audio)),
  }),
)(AudioListContainer);
