import React from 'react';
import { connect } from 'react-redux';
import { Input, Button } from 'antd';
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

  render() {
    const { playListInputValue } = this.state;
    const { playLists = [], newPlayList } = this.props;
    console.log(this.props);
    return (
      <div>
        <Button>ALL Audio</Button>
        <ul>{playLists.map(li => <li key={li.id}>{li.name}</li>)}</ul>
        <PlayListList list={playLists} />
        <Input
          value={playListInputValue}
          onChange={e => this.setState({ playListInputValue: e.target.value })}
        />
        <Button onClick={() => newPlayList(playListInputValue)}>Add PlayList</Button>
      </div>
    );
  }
}

export default connect(
  state => ({
    playLists: state.playListChunk.playLists,
    activePlayListId: state.playListChunk.activePlayListId,
  }),
  dispatch => ({
    newPlayList: name => dispatch(actions.addPlayList(name)),
  }),
)(PlayListContainer);
