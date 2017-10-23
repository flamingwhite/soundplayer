import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Button, Menu, Icon } from 'antd';
import { actions } from '../reducers/groupActionReducer';

export const GroupItem = ({ item }) => {
  const { title } = item;
  return <li>{title}</li>;
};

export const GroupList = ({ list }) => (
  <ul>{list.map(item => <li key={item.id}>{item.name}</li>)}</ul>
);

class NavContainer extends React.Component {
  state = {
    groupInputValue: '',
  };
  menuClick = e => {
    const { setActiveGroup } = this.props;
    const { key } = e;
    let newActive = {};
    if (['all', 'favorite'].includes(key)) newActive = { type: 'default', id: key };
    else newActive = { type: 'custom', id: key };
    setActiveGroup(newActive);
  };

  render() {
    const { groupInputValue } = this.state;
    const { groups = [], newGroup, activeGroup } = this.props;
    console.log(this.props);
    return (
      <div>
        <Menu onClick={this.menuClick} defaultSelectedKeys={[activeGroup.id]} theme="dark">
          <Menu.Item key="all">
            <Icon type="pie-chart" />
            <span>All Music</span>
          </Menu.Item>
          <Menu.Item key="favorite">
            <Icon type="heart" />
            <span>Favorites</span>
          </Menu.Item>
        </Menu>
        <GroupList list={groups} />
        <Link to="/">
          <Button>All</Button>
        </Link>
        <Link to="/favorite">
          <Button>Favorite</Button>
        </Link>
        <Link to="/youtube">
          <Button>YOutube</Button>
        </Link>
        {/*
        <Input
          value={groupInputValue}
          onChange={e => this.setState({ groupInputValue: e.target.value })}
        />*/}
      </div>
    );
  }
}

export default connect(
  state => ({
    groups: state.groupChunk.groups,
    activeGroup: state.groupChunk.activeGroup,
  }),
  dispatch => ({
    newGroup: name => dispatch(actions.addGroup(name)),
    setActiveGroup: group => dispatch(actions.setActiveGroup(group)),
  }),
)(NavContainer);
