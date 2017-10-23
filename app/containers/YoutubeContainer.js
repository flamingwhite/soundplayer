import React from 'react';
import { Input, Button } from 'antd';

const getEmbedUrl = url => {
  const id = url.split('=')[1];
  return `https://www.youtube.com/embed/${id}`;
};

export default class YoutubeContainer extends React.Component {
  state = {
    inputValue: '',
    url: '',
  };

  render() {
    const { url, inputValue } = this.state;
    return (
      <div>
        <Input value={inputValue} onChange={e => this.setState({ inputValue: e.target.value })} />
        <Button onClick={() => this.setState({ url: getEmbedUrl(inputValue) })}>Get Video</Button>
        {url && <iframe width="420" height="315" src={url} frameBorder="0" allowFullScreen />}
      </div>
    );
  }
}
