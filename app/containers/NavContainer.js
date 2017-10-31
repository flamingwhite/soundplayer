import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Button, Menu, Icon } from 'antd';
import { actions } from '../reducers/groupActionReducer';
import { withState } from '../utils/withState';

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
    console.log(this.props, 'from navcontainer');
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

        <Button>{this.props.count}</Button>
        <Button onClick={v => this.props.inc(3, 4)}>inc</Button>
        <Button onClick={v => this.props.dec()}>dec</Button>
        <Button onClick={() => this.props.changeState(state => ({ count: 30 }))}>
          Change to 30
        </Button>
        {/*
        <Input
          value={groupInputValue}
          onChange={e => this.setState({ groupInputValue: e.target.value })}
        />*/}
      </div>
    );
  }
}

const newNav = withState(
  {
    count: 10,
  },
  {
    inc: state => (v, s) => {
      console.log('vsstate', v, s, state);
      return { count: state.count + v + s };
    },
    dec: state => () => ({ count: state.count - 3 }),
  },
)(NavContainer);

export default connect(
  state => ({
    groups: state.groupChunk.groups,
    activeGroup: state.groupChunk.activeGroup,
  }),
  dispatch => ({
    newGroup: name => dispatch(actions.addGroup(name)),
    setActiveGroup: group => dispatch(actions.setActiveGroup(group)),
  }),
)(newNav);
