import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Button, Icon } from 'antd';
import * as R from 'ramda';
import { actions } from '../reducers/groupActionReducer';
import { groupListSelector } from '../selectors/groupSelector';

class GroupContainer extends Component {
  state = {
    groupNameInput: '',
  };

  render() {
    const { groupNameInput } = this.state;
    const { groupList, createNewGroup, removeGroup, setActiveGroup } = this.props;
    return (
      <div>
        <Input
          value={groupNameInput}
          onChange={e => this.setState({ groupNameInput: e.target.value })}
        />
        <Button onClick={() => createNewGroup(groupNameInput)}>Create</Button>
        {groupList.map(group => (
          <div>
            <Link to={`/${group.id}`} onClick={() => setActiveGroup(group.id)}>
              <div>
                <Button>{group.name}</Button>
                <Icon
                  type="close"
                  onClick={e => {
                    e.stopPropagation();
                    removeGroup(group.id);
                  }}
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    );
  }
}

export default R.compose(
  connect(
    state => ({
      groupList: groupListSelector(state),
    }),
    dispatch => ({
      createNewGroup: groupName => dispatch(actions.addGroup(groupName)),
      removeGroup: groupId => dispatch(actions.removeGroup(groupId)),
      setActiveGroup: groupId => dispatch(actions.setActiveGroup(groupId)),
    }),
  ),
)(GroupContainer);
