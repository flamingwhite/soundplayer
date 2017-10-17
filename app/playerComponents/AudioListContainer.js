import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { localAudioPaths, openItemInFolder } from '../utils/getLocalFiles';
import { getNameByPath } from '../utils/audioUtil';
import { actions } from '../reducers/audioActionReducer';

const AudioItem = props => {
  const { onAudioClick, audio, openInFolderClick } = props;

  return (
    <div style={{ padding: 4 }}>
      <span onClick={() => onAudioClick(audio)}>{audio.name}</span>
      <span onClick={() => openInFolderClick(audio)}> Open IN Finder</span>
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
    const { audios, setCurrentPlayingAudio } = this.props;
    return (
      <div>
        {audios.map(au => (
          <AudioItem
            audio={au}
            onAudioClick={setCurrentPlayingAudio}
            openInFolderClick={audio => openItemInFolder(audio.path)}
          />
        ))}
        <Button onClick={this.addAudios}>Add Audio</Button>
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
    setCurrentPlayingAudio: audio => dispatch(actions.setCurrentPlaying(audio)),
  }),
)(AudioListContainer);
