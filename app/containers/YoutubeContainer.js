import React from 'react';
import { connect } from 'react-redux';
import { Input, Button, Modal, Slider } from 'antd';
import { downloadAudio, getMediaInfo, cutMedia, getYoutubeVideoId } from '../utils/mediaUtil';
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
    url: '',
    showMediaModal: false,
    mediaInfo: {},
    timeChunk: [0, 0],
  };
  downloadMedia = () => {
    const { url, mediaInfo } = this.state;
    const { mediaDownloaded } = this.props;
    return downloadAudio(url).then(() => {
      console.log(mediaInfo);
      return mediaDownloaded(mediaInfo);
    });
  };
  downloadMediaChunk = () => {
    const { url, timeChunk, mediaInfo } = this.state;
    const { mediaDownloaded } = this.props;
    return downloadAudio(url)
      .then(() => console.log('downloadeddddddddddddddddddddddddddd'))
      .then(() =>
        cutMedia(
          mediaInfo.path,
          `${mediaInfo.path}cut.mp3`,
          timeChunk[0],
          timeChunk[1] - timeChunk[0],
        ),
      )
      .then(() => replaceFileSync(`${mediaInfo.path}cut.mp3`, mediaInfo.path))
      .then(() => console.log('cutted'))
      .then(() => mediaDownloaded(mediaInfo));
  };
  fetchInfo = () => {
    console.log('fetchinfo start');
    const { inputValue } = this.state;
    const url = getEmbedUrl(inputValue);
    return getMediaInfo(url).then(info => {
      console.log('info get', info);
      this.setState({
        mediaInfo: info,
        url: getEmbedUrl(url),
      });
    });
  };

  render() {
    const { url, inputValue, showMediaModal, mediaInfo, timeChunk } = this.state;
    const [start, end] = timeChunk;
    const { fetchInfo, downloadMedia, downloadMediaChunk } = this;
    const { duration } = mediaInfo;
    return (
      <div>
        <Button onClick={() => this.setState({ showMediaModal: true })}>Play Online Audio</Button>
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
            {JSON.stringify(mediaInfo)}
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
            <Button onClick={this.downloadMediaChunk}>
              Download from {start} - {end}
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
