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
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gridGap: 10 }}>
      <Avatar shape="square" size="large" icon="user" />
      <span style={{ display: 'grid', gridTemplateRows: '1fr 1fr' }}>
        <div>{title}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
          {artist}
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
      </span>
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
