import React from 'react';
import { Button, Slider } from 'antd';
import { connect } from 'react-redux';
import Rx from 'rxjs/Rx';
import * as R from 'ramda';
import { actions, playModes } from '../reducers/audioActionReducer';
import styles from '../components/Main.css';
import { PAUSE_MEDIA, RESUME_PLAY_MEDIA } from '../global/eventConstants';
import { eventOfType$ } from '../global/eventStream';
import lifecycleStream from '../hoc/lifecycleStream';
import { secondsToTimeStr } from '../utils/timeUtil';
import Icon from '../components/MIcon';

const ifElseValue = (pre, trueValue, falseValue) => (pre ? trueValue : falseValue);

class PlayerController extends React.Component {
  state = {
    currentTime: 0,
    duration: 0,
    playing: true,
    volumeBeforeMute: null,
  };
  componentDidMount() {
    const { willUnmount$ } = this.props;
    setTimeout(() => {
      this.audioElm.volume = this.props.volume || 1;
    }, 800);
    this.timeUpdate$.subscribe(currentTime => this.setState({ currentTime }));
    eventOfType$(PAUSE_MEDIA)
      .takeUntil(willUnmount$)
      .subscribe(() => this.pauseClick());

    eventOfType$(RESUME_PLAY_MEDIA)
      .takeUntil(willUnmount$)
      .subscribe(() => this.playClick());
  }

  timeUpdate$ = new Rx.Subject()
    .map(() => Math.floor(this.audioElm.currentTime))
    .distinctUntilChanged();

  playClick = () => {
    this.audioElm.play();
    this.setState({ playing: true });
  };
  pauseClick = () => {
    this.audioElm.pause();
    this.setState({ playing: false });
  };
  render() {
    const {
      currentPlaying,
      playbackEnd,
      volume,
      setVolume,
      playNextAudio,
      playPreviousAudio,
      playModeId,
      nextPlayMode,
    } = this.props;
    const { currentTime, duration, playing, volumeBeforeMute } = this.state;
    const { playClick, pauseClick } = this;
    const activePlayMode = playModes.find(R.propEq('id', playModeId));
    const setVolumeAction = v => {
      setVolume(v);
      this.setState({ volume: v });
      this.audioElm.volume = v;
    };

    const muteClick = () => {
      setVolumeAction(0);
      this.setState({ volumeBeforeMute: volume });
    };
    const unMuteClick = () => {
      const before = volumeBeforeMute || 1;
      setVolumeAction(before);
      this.setState({ volumeBeforeMute: null });
    };

    return (
      <div>
        {!currentPlaying && <div>No Source</div>}
        {currentPlaying && (
          <div style={{ display: 'flex' }}>
            <div
              style={{
                width: 200,
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: 60,
              }}
            >
              <Icon
                type="skip_previous"
                onClick={playPreviousAudio}
                style={{ marginLeft: 30, fontSize: 30 }}
              />
              {playing && <Icon type="pause" onClick={pauseClick} style={{ fontSize: 45 }} />}
              {!playing && <Icon type="play_arrow" onClick={playClick} style={{ fontSize: 45 }} />}
              <Icon
                type="skip_next"
                onClick={playNextAudio}
                style={{ marginRight: 30, fontSize: 30 }}
              />
            </div>
            <div style={{ alignItems: 'center', display: 'flex' }}>
              <Slider
                min={0}
                max={duration}
                value={currentTime}
                step={1}
                onChange={v => {
                  console.log(this.audioElm.played);
                  this.audioElm.currentTime = v;
                }}
                style={{ width: 500 }}
              />
              <span style={{ marginLeft: 10, marginRight: 20 }}>{`${secondsToTimeStr(
                currentTime,
              )}/${secondsToTimeStr(duration)}`}</span>

              <Icon
                type={activePlayMode.icon}
                style={{ fontSize: 25, marginRight: 15 }}
                onClick={nextPlayMode}
              />

              {ifElseValue(
                volume > 0,
                <Icon type="volume_up" onClick={muteClick} style={{ fontSize: 25 }} />,
                <Icon type="volume_mute" onClick={unMuteClick} style={{ fontSize: 25 }} />,
              )}
              <Slider
                min={0}
                max={1}
                value={volume}
                step={0.01}
                onChange={setVolumeAction}
                tipFormatter={v => `${Math.floor(v * 100)}%`}
                style={{ flex: 1, width: 80 }}
              />
            </div>
          </div>
        )}

        {currentPlaying && (
          <span>
            {currentPlaying.title} --- {currentPlaying.artist}{' '}
          </span>
        )}
        {currentPlaying && (
          <audio
            ref={elm => (this.audioElm = elm)}
            // onEnded={() => (playModeId === 'repeat' ? null : playbackEnd())}
            onEnded={() => {
              playbackEnd();
              setTimeout(() => {
                this.audioElm.currentTime = 0;
                this.audioElm.play();
              });
            }}
            onLoadedMetadata={e =>
              this.setState({ duration: Math.floor(e.nativeEvent.target.duration) })}
            onTimeUpdate={e => this.timeUpdate$.next(e.nativeEvent.target.currentTIme)}
            autoPlay
            src={`file://${currentPlaying.path}`}
          />
        )}
      </div>
    );
  }
}

export default R.compose(
  lifecycleStream,
  connect(
    state => ({
      currentPlaying: state.audioChunk.currentPlaying,
      volume: state.audioChunk.volume,
      playModeId: state.audioChunk.playModeId,
    }),
    dispatch => ({
      playbackEnd: () => dispatch(actions.playbackEnd()),
      playNextAudio: () => dispatch(actions.playNextAudio()),
      playPreviousAudio: () => dispatch(actions.playPreviousAudio()),
      setVolume: volume => dispatch(actions.setVolume(volume)),
      nextPlayMode: () => dispatch(actions.nextPlayMode()),
    }),
  ),
)(PlayerController);
