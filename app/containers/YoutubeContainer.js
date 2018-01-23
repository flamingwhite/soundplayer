import React from 'react';
import { connect } from 'react-redux';
import { Input, Button, Modal, Slider, Spin, message } from 'antd';
import path from 'path';
import * as R from 'ramda';
import { onlineAudios } from '../selectors/audioSelectors';
import {
  getAudioFolder,
  getVideoFolder,
  downloadAudio,
  getYoutubeVideoId,
  downloadAndCutMedia,
  getFilenameByUrl,
  getDurationByUrl
} from '../utils/mediaUtil';
import { actions } from '../reducers/audioActionReducer';
import { secondsToTimeStr } from '../utils/timeUtil';
import { PAUSE_MEDIA } from '../global/eventConstants';
import { publishEvent } from '../global/eventStream';

const getEmbedUrl = url => {
  const id = getYoutubeVideoId(url);
  return `https://www.youtube.com/embed/${id}`;
};

// const YoutubeAudioList = R.compose(connect(state => ({ audios: onlineAudios(state) })))(
//   AudioListWithDefault,
// );

const defaultState = {
  url: null,
  loading: false,
  showMediaModal: false,
  name: null,
  duration: null,
  timeChunk: [0, 0]
};

class YoutubeContainer extends React.Component {
  state = { ...defaultState };

  closeModal = () => this.setState({ ...defaultState });
  downloadMedia = (type = 'audio') => {
    const { url, name, duration } = this.state;
    const { mediaDownloaded } = this.props;
    return downloadAudio(url).then(() => {
      console.log(mediaInfo);
      return mediaDownloaded({ name, duration });
    });
  };

  downloadMediaChunk = (type = 'audio') => {
    const { url, timeChunk, name, duration } = this.state;
    const { mediaDownloaded } = this.props;
    const mediaFolder = type === 'audio' ? getAudioFolder() : getVideoFolder();
    let startDuration = null;
    if (timeChunk && timeChunk[0] != null) {
      startDuration = {
        start: timeChunk[0],
        duration: timeChunk[1] - timeChunk[0]
      };
    }

    this.setState({ loading: true });

    return downloadAndCutMedia({
      url,
      filenameWithoutExt: name,
      mediaFolder,
      type,
      startDuration
    })
      .then(mediaDownloaded)
      .then(() => this.setState({ loading: false, showMediaModal: false }))
      .then(() => message.success('Media Added'))
      .catch(e => {
        this.setState({ loading: false });
        message.error('Something went wrong!');
      });
  };

  fetchInfo = inputValue => {
    console.log('fetchinfo start');
    // const { inputValue } = this.state;
    const url = getEmbedUrl(inputValue);
    this.setState({
      url,
      name: null,
      duration: null,
      timeChunk: [0, 0]
    });
    publishEvent(PAUSE_MEDIA);

    getFilenameByUrl(url).then(name => {
      console.log('name fetch', name);
      this.setState({ name });
    });
    getDurationByUrl(url).then(duration =>
      this.setState({ duration, timeChunk: [0, duration] })
    );
  };

  render() {
    const {
      url,
      inputValue,
      showMediaModal,
      name,
      duration,
      timeChunk,
      loading
    } = this.state;
    const [start, end] = timeChunk;
    const { fetchInfo, downloadMedia, downloadMediaChunk } = this;
    return (
      <div>
        <Button onClick={() => this.setState({ showMediaModal: true })}>
          Play Online Audio
        </Button>
        <video width="320" height="240" controls>
          <source src={`file://${getVideoFolder()}/testvideo.mp4`} />
        </video>
        {showMediaModal && (
          <Modal
            title="Add Online"
            visible={showMediaModal}
            footer={null}
            onCancel={this.closeModal}
          >
            <Spin spinning={loading} tip={'Processing'}>
              <Input.Search placeholder="Media URL" onSearch={this.fetchInfo} />
              {url && (
                <iframe
                  width="420"
                  height="315"
                  src={url}
                  frameBorder="0"
                  allowFullScreen
                />
              )}
              {url}
              {duration && (
                <Slider
                  range
                  defaultState={[0, duration]}
                  max={duration}
                  tipFormatter={secondsToTimeStr}
                  onAfterChange={v => this.setState({ timeChunk: v })}
                />
              )}
              {!duration && name && <div>Loading Duration Information</div>}
              {duration && [
                <Button onClick={this.downloadMedia}>Download Audio</Button>,
                <Button onClick={() => this.downloadMediaChunk('audio')}>
                  Download from {start} - {end}
                </Button>,
                <Button onClick={() => this.downloadMediaChunk('video')}>
                  Video from {start} - {end}
                </Button>
              ]}
            </Spin>
          </Modal>
        )}
      </div>
    );
  }
}

export default R.compose(
  connect(
    state => ({}),
    dispatch => ({
      mediaDownloaded: info => dispatch(actions.mediaDownloaded(info))
    })
  )
)(YoutubeContainer);
