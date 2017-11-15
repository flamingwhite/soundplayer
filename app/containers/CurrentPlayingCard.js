import React from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { Card, Avatar } from 'antd';
import { actions } from '../reducers/audioActionReducer';
import Icon from '../components/MIcon';

const ifElseValue = (pre, trueValue, falseValue) => (pre ? trueValue : falseValue);

const CurrentPlayingCard = props => {
  const { currentPlaying, addAudioToFavorite, removeAudioFromFavorite } = props;
  const { id, title, artist } = currentPlaying;
  const favorite = R.path(['groups', 'favorite'], currentPlaying);

  return (
    <div style={{ display: 'flex' }}>
      <Avatar shape="square" size="large" icon="user" style={{ marginLeft: 10 }} />
      <span style={{ flex: 1, padding: '0 8px' }}>
        <div>{title}</div>
        <div>{artist}</div>
      </span>
      {ifElseValue(
        favorite,
        <i
          className="material-icons"
          style={{ color: 'red' }}
          onClick={() => removeAudioFromFavorite(id)}
        >
          favorite
        </i>,
        <i className="material-icons" onClick={() => addAudioToFavorite(id)}>
          favorite_border
        </i>,
      )}
    </div>
  );
};

export default connect(
  state => ({ currentPlaying: state.audioChunk.currentPlaying }),
  dispatch => ({
    addAudioToFavorite: id => dispatch(actions.addAudioToFavorite(id)),
    removeAudioFromFavorite: id => dispatch(actions.removeAudioFromFavorite(id)),
  }),
)(CurrentPlayingCard);
