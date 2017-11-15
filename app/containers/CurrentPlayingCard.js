import React from 'react';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { Card, Avatar } from 'antd';
import { actions } from '../reducers/audioActionReducer';

const CurrentPlayingCard = props => {
  const { title, artist, favorite, addAudioToFavorite, removeAudioFromFavorite } = props;

  return (
    <Card>
      <Card.Grid style={{ width: '30%' }}>{title}</Card.Grid>
      <Card.Grid style={{ width: '70%' }}>This is the avatar</Card.Grid>
    </Card>
  );
};

export default connect(
  state => {
    const { currentPlaying } = state.audioChunk;
    if (!currentPlaying) return {};
    const { id, title, artist } = currentPlaying;
    const favorite = R.pathEq(['groups', 'favorite'], true, currentPlaying);
    return { id, title, artist, favorite };
  },
  dispatch => ({
    addAudioToFavorite: id => dispatch(actions.addAudioToFavorite(id)),
    removeAudioFromFavorite: id => dispatch(actions.removeAudioFromFavorite(id)),
  }),
)(CurrentPlayingCard);
