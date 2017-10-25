import React from 'react';
import { connect } from 'react-redux';
import { Input, Button, Modal } from 'antd';
import { getMusicFolder, downloadAudio } from '../utils/mediaUtil';
import { actions } from '../reducers/audioActionReducer';

const getEmbedUrl = url => {
  const id = url.split('=')[1];
  return `https://www.youtube.com/embed/${id}`;
};

class YoutubeContainer extends React.Component {
  state = {
    inputValue: '',
    url: '',
    showMediaModal: false,
  };
  downloadMedia = () => {
    const { url } = this.state;
    const { mediaDownloaded } = this.props;
    return downloadAudio(url).then(info => {
      console.log(info);
      return mediaDownloaded(info);
    });
  };

  render() {
    const { url, inputValue, showMediaModal } = this.state;
    return (
      <div>
        <Button onClick={() => this.setState({ showMediaModal: true })}>Play Online Audio</Button>
        {showMediaModal && (
          <Modal
            title="Add Online"
            visible={showMediaModal}
            onOk={() => {
              this.downloadMedia().then(() => this.setState({ showMediaModal: false }));
            }}
          >
            <Input
              value={inputValue}
              onChange={e => this.setState({ inputValue: e.target.value })}
            />
            {url && <iframe width="420" height="315" src={url} frameBorder="0" allowFullScreen />}
            <Button onClick={() => this.setState({ url: getEmbedUrl(inputValue) })}>
              Get Video
            </Button>
            <Button onClick={this.downloadMedia}>Download Audio</Button>
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
