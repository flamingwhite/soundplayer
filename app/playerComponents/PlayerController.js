import React from 'react';
import { Button, Slider } from 'antd';
import { connect } from 'react-redux';
import { convertSong } from '../utils/audioUtil';
import { actions } from '../reducers/audioActionReducer';

class PlayerController extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.audioElm.volume = this.props.volume || 1;
    }, 400);
  }
  render() {
    const {
      currentPlaying,
      playbackEnd,
      volume,
      setVolume,
      playNextAudio,
      playPreviousAudio,
    } = this.props;
    return (
      <div>
        <Slider
          min={0}
          max={1}
          value={volume}
          step={0.01}
          onChange={v => {
            setVolume(v);
            this.audioElm.volume = v;
          }}
          tipFormatter={v => `${Math.floor(v * 100)}%`}
          style={{ width: 200, float: 'left' }}
        />
        {currentPlaying && (
          <span>
            <Button onClick={playPreviousAudio}>Previous</Button>
            <Button onClick={playNextAudio}>Next</Button>
            {currentPlaying.title} --- {currentPlaying.artist}{' '}
          </span>
        )}
        {currentPlaying && (
          <audio
            ref={elm => (this.audioElm = elm)}
            onEnded={playbackEnd}
            // onVolumeChange={() => {
            //   console.log('volumn changed', this.audioElm.volume);
            //   setVolume(this.audioElm.volume);
            // }}
            controls="controls"
            autoPlay
            src={`file://${currentPlaying.path}`}
          />
        )}
      </div>
    );
  }
}

export default connect(
  state => ({
    currentPlaying: state.audioChunk.currentPlaying,
    volume: state.audioChunk.volume,
  }),
  dispatch => ({
    playbackEnd: () => dispatch(actions.playbackEnd()),
    playNextAudio: () => dispatch(actions.playNextAudio()),
    playPreviousAudio: () => dispatch(actions.playPreviousAudio()),
    setVolume: volume => dispatch(actions.setVolume(volume)),
  }),
)(PlayerController);
