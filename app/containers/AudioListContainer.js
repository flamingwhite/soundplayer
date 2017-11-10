import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import { Button, Table, Icon, Divider, Popover, Checkbox } from 'antd';
import { localAudioPaths, openItemInFolder } from '../utils/getLocalFiles';
import { getNameByPath } from '../utils/audioUtil';
import { actions } from '../reducers/audioActionReducer';
import { getMd5 } from '../utils/idUtil';
import lifecycleStream from '../hoc/lifecycleStream';
import { groupListSelector, groupListForDropdownSelector } from '../selectors/groupSelector';
import { visibleAudios } from '../selectors/audioSelectors';

const { Column, ColumnGroup } = Table;

const formatSec = sec => `${Math.floor(sec / 60)}:${sec % 60}`;

export const AudioList = props => {
  const {
    audios,
    currentPlaying,
    onAudioClick,
    addAudioToFavorite,
    removeAudioFromFavorite,
    openInFolderClick,
    removeAudio,
    addAudioToGroup,
    removeAudioFromGroup,
    groupListForDropdown,
  } = props;
  return (
    <Table
      size="small"
      pagination={false}
      dataSource={audios}
      onRowDoubleClick={onAudioClick}
      rowClassName={row => (row.id === currentPlaying.id ? 'row-active' : '')}
      rowKey={row => row.id}
    >
      <Column
        render={(text, record, index) => (
          <span>
            <span style={{ marginRight: 10 }}>{index < 9 ? `0${index + 1}` : index + 1}</span>
            {R.path(['groups', 'favorite'], record) ? (
              <Icon
                type="heart"
                style={{ color: 'red' }}
                onClick={() => removeAudioFromFavorite(record)}
              />
            ) : (
              <Icon type="heart-o" onClick={() => addAudioToFavorite(record)} />
            )}
          </span>
        )}
      />
      <Column
        title="Title"
        dataIndex="title"
        width="50%"
        render={(text, record) => record.title || record.name}
      />
      <Column title="Artist" dataIndex="artist" width={200} />
      <Column
        title="Action"
        render={(text, record) => (
          <span>
            <Popover
              trigger="click"
              title="Set Group"
              content={
                <div>
                  {groupListForDropdown.map(group => (
                    <Checkbox
                      key={group.id}
                      checked={R.pathEq(['groups', group.id], true, record)}
                      onChange={e =>
                        e.target.checked
                          ? addAudioToGroup(record.id, group.id)
                          : removeAudioFromGroup(record.id, group.id)}
                    >
                      {group.name}
                    </Checkbox>
                  ))}
                </div>
              }
            >
              <Icon type="folder" />
            </Popover>
            <Icon
              type="folder"
              onClick={() => openInFolderClick(record)}
              style={{ marginRight: 10 }}
            />
            <Icon type="delete" onClick={() => removeAudio(record)} />
          </span>
        )}
      />
    </Table>
  );
};

export const AudioListWithDefault = R.compose(
  lifecycleStream,
  connect(
    (state, ownProps) => ({
      currentPlaying: ownProps.currentPlaying || state.audioChunk.currentPlaying,
      groupList: ownProps.groupList || groupListSelector(state),
      groupListForDropdown: ownProps.groupListForDropdown || groupListForDropdownSelector(state),
    }),
    (dispatch, ownProps) => ({
      addAudio: ownProps.addAudio || (audio => dispatch(actions.addAudio(audio))),
      addAudioToFavorite:
        ownProps.addAudioToFavorite || (audio => dispatch(actions.addAudioToFavorite(audio.id))),
      removeAudioFromFavorite:
        ownProps.removeAudioFromFavorite ||
        (audio => dispatch(actions.removeAudioFromFavorite(audio.id))),
      removeAudio: ownProps.removeAudio || (audio => dispatch(actions.removeAudio(audio.id))),
      onAudioClick: ownProps.onAudioClick || (audio => dispatch(actions.setCurrentPlaying(audio))),
      openInFolderClick: ownProps.openInFolderClick || (audio => openItemInFolder(audio.path)),
      addAudioToGroup:
        ownProps.addAudioToGroup ||
        ((audioId, groupId) => dispatch(actions.addAudioToGroup({ audioId, groupId }))),
      removeAudioFromGroup:
        ownProps.removeAudioFromGroup ||
        ((audioId, groupId) => dispatch(actions.removeAudioFromGroup({ audioId, groupId }))),
    }),
  ),
)(AudioList);

class AudioListContainer extends React.Component {
  addAudios = () => {
    const { addMultipleAudios } = this.props;
    return localAudioPaths().then(paths =>
      addMultipleAudios(
        paths.map(p => ({
          id: getMd5(p),
          path: p,
          name: getNameByPath(p),
        })),
      ),
    );
  };

  render() {
    const { audios, removeAllAudio } = this.props;
    return (
      <div>
        <AudioListWithDefault audios={audios} />
        <Button onClick={this.addAudios}>Add Audio</Button>
        <Button onClick={removeAllAudio}>Remove ALL</Button>
      </div>
    );
  }
}

export default connect(
  state => ({
    audios: visibleAudios(state),
  }),
  dispatch => ({
    removeAllAudio: () => dispatch(actions.removeAllAudio()),
    addMultipleAudios: audios => dispatch(actions.addMultipleAudios(audios)),
  }),
)(AudioListContainer);
