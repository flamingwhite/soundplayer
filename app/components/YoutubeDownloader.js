import React from 'react';
import { Input, Button } from 'antd';

class YoutubeDownloader extends React.Component {
  constructor() {
    super();
    console.log(__dirname);
  }
  state = {
    value: '',
  };

  fetchVideoInfo = url => {
    console.log('url is ', url);
    // const video = youtube(url, {
    //   cwd: __dirname,
    // });
    // video.on('info', info => {
    //   console.log('info is ', info);
    // });
  };

  render() {
    const { value } = this.state;
    const { fetchVideoInfo } = this;
    return (
      <div>
        <Input value={value} onChange={e => this.setState({ value: e.target.value })} />
        <Button type="primary" onClick={() => fetchVideoInfo(value)}>
          Fetch
        </Button>
      </div>
    );
  }
}

export default YoutubeDownloader;
