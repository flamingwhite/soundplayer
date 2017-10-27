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
        <video height="320" width="400">
          <source src="http://pl-ali.youku.com/playlist/m3u8?vid=XMzAxOTU2MDg0NA%3D%3D&type=hd2&ups_client_netip=24.158.250.152&ups_ts=1509055879&utid=hkt5EoelXWoCARie%2BpgLm9K8&ccode=0401&psid=bb63a810075792cd710993c724b349d5&duration=1075&expire=18000&ups_key=a143040d5d3c2c89641f06186424f502" />
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
