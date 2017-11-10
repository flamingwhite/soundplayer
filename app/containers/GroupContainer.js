import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Button, Icon } from 'antd';
import { withStateHandlers, pure } from 'recompose';
import * as R from 'ramda';
import { actions } from '../reducers/groupActionReducer';
import { groupListSelector } from '../selectors/groupSelector';

const GroupContainer = props => {
  const {
    groupNameInput,
    groupList,
    createNewGroup,
    removeGroup,
    setActiveGroup,
    changeInput,
  } = props;
  return (
    <div>
      <Input value={groupNameInput} onChange={e => changeInput(e.target.value)} />
      <Button onClick={() => createNewGroup(groupNameInput)}>Create</Button>
      {groupList.map(group => (
        <div key={group.id}>
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
};

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
  withStateHandlers(
    { groupNameInput: '' },
    {
      changeInput: () => input => ({ groupNameInput: input }),
    },
  ),
  pure,
)(GroupContainer);
