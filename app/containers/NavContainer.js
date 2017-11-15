import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Button, Menu, Icon } from 'antd';
import * as R from 'ramda';
import { compose, branch } from 'recompose';
import { actions } from '../reducers/groupActionReducer';
import GroupContainer from './GroupContainer';
import CurrentPlayingCard from './CurrentPlayingCard';
import { withState } from '../utils/withState';
import lifecycleStream from '../hoc/lifecycleStream';
import { publishEvent } from '../global/eventStream';
import { PAUSE_MEDIA, RESUME_PLAY_MEDIA } from '../global/eventConstants';

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
    const {
      groups = [],
      currentPlaying,
      newGroup,
      activeGroup,
      setActiveGroup,
      resetGroupState,
    } = this.props;
    console.log(this.props, 'from navcontainer');
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1 }}>
          <Button onClick={resetGroupState}>Reset_Group</Button>
          <Link to="/youtube" onClick={() => setActiveGroup('onlineDownload')}>
            <Button>WebDownload</Button>
          </Link>
          <GroupContainer />
        </div>
        {currentPlaying && (
          <div
            style={{
              borderTop: '1px solid lightgray',
              marginBottom: 10,
              paddingTop: 10,
            }}
          >
            <CurrentPlayingCard />
          </div>
        )}
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
      currentPlaying: state.audioChunk.currentPlaying,
    }),
    dispatch => ({
      newGroup: name => dispatch(actions.addGroup(name)),
      setActiveGroup: group => dispatch(actions.setActiveGroup(group)),
      resetGroupState: () => dispatch(actions.resetGroupState()),
    }),
  ),
)(NavContainer);
