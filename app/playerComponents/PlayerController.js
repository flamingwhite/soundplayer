import React from 'react';
import { connect } from 'react-redux';
import { convertSong } from '../utils/audioUtil';
import { actions } from '../reducers/audioActionReducer';

class PlayerController extends React.Component {
  //   state = {
  //     url: null,
  //   };
  //   componentDidMount() {
  //     if (!this.props.currentPlaying) return;
  //     const { path } = this.props.currentPlaying;
  //     if (path) {
  //       return convertSong(path).then(url => {
  //         console.log(url.slice(0, 30));
  //         this.setState({ url });
  //       });
  //     }
  //   }
  //   componentWillReceiveProps(nextProps) {
  //     if (nextProps.currentPlaying) {
  //       return convertSong(nextProps.currentPlaying.path).then(url => {
  //         console.log(url.slice(0, 30));
  //         this.setState({ url });
  //       });
  //     }
  //   }
  render() {
    // const { url } = this.state;
    const { currentPlaying, playbackEnd } = this.props;
    return (
      <div>
        {currentPlaying && (
          <audio
            onEnded={playbackEnd}
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
  }),
  dispatch => ({
    playbackEnd: () => dispatch(actions.playbackEnd()),
  }),
)(PlayerController);
