import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Button } from 'antd';
import { withStateHandlers, pure } from 'recompose';
import * as R from 'ramda';
import Icon from '../components/MIcon';
import { actions } from '../reducers/groupActionReducer';
import { groupListSelector } from '../selectors/groupSelector';

const GroupItem = props => {
  const { group, onGroupClick, onRemoveClick, icon = 'playlist_play' } = props;

  return (
    <li key={group.id} className="group-menu-item">
      <Link to={`/${group.id}`} onClick={() => onGroupClick(group.id)}>
        <div>
          <Icon type={icon} />
          <span>{group.name}</span>
          {/*
          <Icon
            type="close"
            onClick={e => {
              e.stopPropagation();
              onRemoveClick(group.id);
            }}
          />
        */}
        </div>
      </Link>
    </li>
  );
};

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
      <ul className="group-menu">
        {groupList.map(group => (
          <GroupItem group={group} onGroupClick={setActiveGroup} onRemoveClick={removeGroup} />
        ))}
      </ul>
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
