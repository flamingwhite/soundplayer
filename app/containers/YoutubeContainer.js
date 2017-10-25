import React from 'react';
import { connect } from 'react-redux';
import { Input, Button } from 'antd';
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
    const { url, inputValue } = this.state;
    return (
      <div>
        <Input value={inputValue} onChange={e => this.setState({ inputValue: e.target.value })} />
        <Button onClick={() => this.setState({ url: getEmbedUrl(inputValue) })}>Get Video</Button>
        {url && <iframe width="420" height="315" src={url} frameBorder="0" allowFullScreen />}
        <Button onClick={this.downloadMedia}>Download Audio</Button>
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
