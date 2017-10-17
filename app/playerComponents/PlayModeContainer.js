import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { playModes, actions } from '../reducers/audioActionReducer';

class PlayModeContainer extends React.Component {
  render() {
    const { playModeId } = this.props;
    return (
      <div>
        <p>Select Playmode</p>
        {playModes.map(mode => (
          <Button type={mode.id === playModeId ? 'primary' : 'default'}>{mode.label}</Button>
        ))}
      </div>
    );
  }
}

export default connect(
  state => ({
    playModeId: state.audioChunk.playModeId,
  }),
  dispatch => ({
    setPlayModeId: playModeId => dispatch(actions.setPlayMode(playModeId)),
  }),
)(PlayModeContainer);
