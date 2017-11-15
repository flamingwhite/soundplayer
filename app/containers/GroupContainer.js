import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Button } from 'antd';
import { withStateHandlers, pure } from 'recompose';
import * as R from 'ramda';
import Icon from '../components/MIcon';
import { actions } from '../reducers/groupActionReducer';
import { groupListSelector } from '../selectors/groupSelector';
import { setTimeout } from 'timers';

const GroupItem = props => {
  const { group, onGroupClick, onRemoveClick, icon = 'queue_music' } = props;

  return (
    <li key={group.id} className="group-menu-item">
      <Link to={`/${group.id}`} onClick={() => onGroupClick(group.id)}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon type={group.icon || 'queue_music'} style={{ color: '#666' }} />
          <span style={{ marginLeft: 7 }}>{group.name}</span>
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

class GroupContainer extends React.Component {
  state = { showInput: false, groupNameInput: '' };
  changeInput = input => this.setState({ groupNameInput: input });

  render() {
    const { groupList, createNewGroup, removeGroup, setActiveGroup } = this.props;
    const { showInput, groupNameInput } = this.state;
    const { changeInput } = this;
    const handleKeyPress = e => {
      console.log(e, e.keyCode, e.target);
      if (e.keyCode === 13) {
        if (!R.isEmpty(groupNameInput)) {
          createNewGroup(groupNameInput);
          this.setState({ showInput: false, groupNameInput: '' });
        }
      }
      if (e.keyCode === 27) {
        this.setState({
          showInput: false,
          groupNameInput: '',
        });
      }
    };
    return (
      <div>
        <div style={{ display: 'flex', marginBottom: 10, marginLeft: 10, fontSize: 16 }}>
          <span style={{ flex: 1 }}>Playlist</span>
          {showInput ? (
            <Icon
              style={{ marginRight: 5 }}
              type="close"
              onClick={() =>
                this.setState({
                  showInput: false,
                })}
            />
          ) : (
            <Icon
              style={{ marginRight: 5 }}
              type="playlist_add"
              onClick={() => {
                setTimeout(() => this.inputElm.focus(), 300);
                this.setState({
                  showInput: true,
                  groupNameInput: '',
                });
              }}
            />
          )}
        </div>
        <ul className="group-menu">
          {showInput && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon type={'queue_music'} style={{ color: '#666' }} />
              <Input
                ref={elm => (this.inputElm = elm)}
                style={{ marginLeft: 7, width: 100 }}
                value={groupNameInput}
                onChange={e => changeInput(e.target.value)}
                onKeyUp={e => handleKeyPress(e)}
              />
            </div>
          )}
          {groupList.map(group => (
            <GroupItem group={group} onGroupClick={setActiveGroup} onRemoveClick={removeGroup} />
          ))}
        </ul>
      </div>
    );
  }
}

// const GroupContainer = props => {
//   const {
//     groupNameInput,
//     groupList,
//     createNewGroup,
//     removeGroup,
//     setActiveGroup,
//     changeInput,
//   } = props;
//   return (
//     <div>
//       <div>
//         <span>Create Playlist</span>
//       </div>
//       <Input value={groupNameInput} onChange={e => changeInput(e.target.value)} />
//       <Button onClick={() => createNewGroup(groupNameInput)}>Create</Button>
//       <ul className="group-menu">
//         {groupList.map(group => (
//           <GroupItem group={group} onGroupClick={setActiveGroup} onRemoveClick={removeGroup} />
//         ))}
//       </ul>
//     </div>
//   );
// };

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
  pure,
)(GroupContainer);
