import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { favoriteAudios } from '../selectors/audioSelectors';
import { AudioListWithDefault } from '../containers/AudioListContainer';

const FavoriteAudioList = R.compose(
  connect(state => ({
    audios: favoriteAudios(state),
  })),
)(AudioListWithDefault);

class FavoriteAudiosContainer extends Component {
  render() {
    return (
      <div>
        <FavoriteAudioList />
      </div>
    );
  }
}

export default FavoriteAudiosContainer;
