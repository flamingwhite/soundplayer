import React from 'react';
import { connect } from 'react-redux';
import { Input, Button, Menu, Icon } from 'antd';
import { actions } from '../reducers/playListActionReducer';

export const PlayListItem = ({ item }) => {
  const { title } = item;
  return <li>{title}</li>;
};

export const PlayListList = ({ list }) => (
  <ul>{list.map(item => <li key={item.id}>{item.name}</li>)}</ul>
);

class PlayListContainer extends React.Component {
  state = {
    playListInputValue: '',
  };
  menuClick = e => {
    const { setActivePlaylist } = this.props;
    const { key } = e;
    let newActive = {};
    if (['all', 'favorite'].includes(key)) newActive = { type: 'default', id: key };
    else newActive = { type: 'custom', id: key };
    setActivePlaylist(newActive);
  };

  render() {
    const { playListInputValue } = this.state;
    const { playLists = [], newPlayList, activePlayList } = this.props;
    console.log(this.props);
    return (
      <div>
        <Menu onClick={this.menuClick} defaultSelectedKeys={[activePlayList.id]} theme="dark">
          <Menu.Item key="all">
            <Icon type="pie-chart" />
            <span>All Music</span>
          </Menu.Item>
          <Menu.Item key="favorite">
            <Icon type="heart" />
            <span>Favorites</span>
          </Menu.Item>
        </Menu>
        <PlayListList list={playLists} />
        {/*
        <Input
          value={playListInputValue}
          onChange={e => this.setState({ playListInputValue: e.target.value })}
        />*/}
      </div>
    );
  }
}

export default connect(
  state => ({
    playLists: state.playlistChunk.playLists,
    activePlayList: state.playlistChunk.activePlayList,
  }),
  dispatch => ({
    newPlayList: name => dispatch(actions.addPlayList(name)),
    setActivePlaylist: playlist => dispatch(actions.setActivePlaylist(playlist)),
  }),
)(PlayListContainer);
