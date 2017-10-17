import React from 'react';
import { connect } from 'react-redux';

export const PlayListItem = item => {
  const { label, id } = item;
  return <li>{label}</li>;
};

export const PlayLists = lists => <ul>{lists.map(PlayListItem)}</ul>;

@connect(state => ({
  playLists: state.playListChunk.playLists,
}))
class PlayListContainer extends React.Component {}

export default PlayListContainer;
