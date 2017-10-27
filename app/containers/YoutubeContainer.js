import React from 'react';
import { connect } from 'react-redux';
import { Input, Button, Modal, Slider } from 'antd';
import path from 'path';
import {
  getAudioFolder,
  getVideoFolder,
  downloadAudio,
  getMediaInfo,
  getYoutubeVideoId,
  downloadAndCutMedia,
  getFilenameByUrl,
  getDurationByUrl,
} from '../utils/mediaUtil';
import { actions } from '../reducers/audioActionReducer';
import { secondsToTimeStr } from '../utils/timeUtil';
import { replaceFileSync } from '../utils/getLocalFiles';

const getEmbedUrl = url => {
  const id = getYoutubeVideoId(url);
  return `https://www.youtube.com/embed/${id}`;
};

class YoutubeContainer extends React.Component {
  state = {
    inputValue: '',
    url: null,
    showMediaModal: false,
    name: null,
    duration: null,
    timeChunk: [0, 0],
  };
  downloadMedia = () => {
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
    if (timeChunk && timeChunk[0]) {
      startDuration = {
        start: timeChunk[0],
        duration: timeChunk[1] - timeChunk[0],
      };
    }

    return downloadAndCutMedia({
      url,
      filenameWithoutExt: name,
      mediaFolder,
      type,
      startDuration,
    }).then(mediaDownloaded);
  };

  fetchInfo = () => {
    console.log('fetchinfo start');
    const { inputValue } = this.state;
    const url = getEmbedUrl(inputValue);

    this.setState({ url, name: null, duration: null, timeChunk: [0, 0] });
    getFilenameByUrl(url).then(name => {
      console.log('name fetch', name);
      this.setState({ name });
    });
    getDurationByUrl(url).then(duration => this.setState({ duration }));
  };

  //   fetchInfo = () => {
  //     console.log('fetchinfo start');
  //     const { inputValue } = this.state;
  //     const url = getEmbedUrl(inputValue);
  //     return getMediaInfo(url).then(info => {
  //       console.log('info get', info);
  //       this.setState({
  //         name: info.name,
  //         duration: info.duration,
  //         url: getEmbedUrl(url),
  //       });
  //     });
  //   };

  render() {
    const { url, inputValue, showMediaModal, name, duration, timeChunk } = this.state;
    const [start, end] = timeChunk;
    const { fetchInfo, downloadMedia, downloadMediaChunk } = this;
    return (
      <div>
        <Button onClick={() => this.setState({ showMediaModal: true })}>Play Online Audio</Button>
        <video width="320" height="240" controls>
          <source src={`file://${getVideoFolder()}/testvideo.mp4`} />
        </video>
        {showMediaModal && (
          <Modal
            title="Add Online"
            visible={showMediaModal}
            footer={null}
            onCancel={() => this.setState({ showMediaModal: false })}
          >
            <Input
              value={inputValue}
              onChange={e => this.setState({ inputValue: e.target.value })}
            />
            {url && <iframe width="420" height="315" src={url} frameBorder="0" allowFullScreen />}
            {url}
            {JSON.stringify({ name, duration })}
            {duration && (
              <Slider
                range
                defaultValue={[0, duration]}
                max={duration}
                tipFormatter={secondsToTimeStr}
                onAfterChange={v => this.setState({ timeChunk: v })}
              />
            )}
            <Button onClick={this.fetchInfo}>Get Video</Button>
            <Button onClick={this.downloadMedia}>Download Audio</Button>
            <Button onClick={() => this.downloadMediaChunk('audio')}>
              Download from {start} - {end}
            </Button>
            <Button onClick={() => this.downloadMediaChunk('video')}>
              Video from {start} - {end}
            </Button>
          </Modal>
        )}
      </div>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({
    mediaDownloaded: info => dispatch(actions.mediaDownloaded(info)),
  }),
)(YoutubeContainer);
