import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Button, Menu, Icon } from 'antd';
import * as R from 'ramda';
import { compose, branch } from 'recompose';
import { actions } from '../reducers/groupActionReducer';
import GroupContainer from './GroupContainer';
import { withState } from '../utils/withState';
import lifecycleStream from '../hoc/lifecycleStream';
import { publishEvent } from '../global/eventStream';
import { PAUSE_MEDIA, RESUME_PLAY_MEDIA } from '../global/eventConstants';

export const GroupItem = ({ item }) => {
  const { title } = item;
  return <li>{title}</li>;
};

export const GroupList = ({ list }) => (
  <ul>{list.map(item => <li key={item.id}>{item.name}</li>)}</ul>
);

class NavContainer extends React.Component {
  componentDidMount() {
    this.props.didMount$.subscribe(() => console.log('didmount subscribe'));
  }
  menuClick = e => {
    const { setActiveGroup } = this.props;
    const { key } = e;
    let newActive = {};
    if (['all', 'favorite'].includes(key)) newActive = { type: 'default', id: key };
    else newActive = { type: 'custom', id: key };
    setActiveGroup(newActive);
  };

  render() {
    const { groups = [], newGroup, activeGroup, setActiveGroup } = this.props;
    console.log(this.props, 'from navcontainer');
    return (
      <div>
        <Menu onClick={this.menuClick} defaultSelectedKeys={[activeGroup.id]}>
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
        <Link to="/youtube" onClick={() => setActiveGroup('onlineDownload')}>
          <Button>WebDownload</Button>
        </Link>

        <GroupContainer />

        <Button style={{ marginTop: 20, display: 'block' }}>{this.props.count}</Button>
        <Button onClick={v => this.props.inc(3, 4)}>inc</Button>
        <Button onClick={v => this.props.dec()}>dec</Button>
        <Button onClick={() => this.props.changeState(state => ({ count: 30 }))}>
          Change to 30
        </Button>
        <Button onClick={() => publishEvent(PAUSE_MEDIA)}>Pause_Media</Button>
        <Button onClick={() => publishEvent(RESUME_PLAY_MEDIA)}>RESUME_PLAY</Button>
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

export default R.compose(
  lifecycleStream,
  withState(
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
  ),
  connect(
    state => ({
      groups: state.groupChunk.groups,
      activeGroup: state.groupChunk.activeGroup,
    }),
    dispatch => ({
      newGroup: name => dispatch(actions.addGroup(name)),
      setActiveGroup: group => dispatch(actions.setActiveGroup(group)),
    }),
  ),
)(NavContainer);
