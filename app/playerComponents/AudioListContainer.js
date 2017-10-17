import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { localAudioPaths } from '../utils/getLocalFiles';
import { getNameByPath } from '../utils/audioUtil';
import { actions } from '../reducers/audioActionReducer';

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
          <div style={{ padding: 4 }} onClick={() => setCurrentPlayingAudio(au)} key={au.path}>
            {au.name}
          </div>
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
