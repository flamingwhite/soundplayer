import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import { Button, Input, Table, Popover, Checkbox } from 'antd';
import { withStateHandlers } from 'recompose';
import VisibilitySensor from 'react-visibility-sensor';
import { localAudioPaths, openItemInFolder } from '../utils/getLocalFiles';
import { getNameByPath } from '../utils/audioUtil';
import { actions } from '../reducers/audioActionReducer';
import { getMd5 } from '../utils/idUtil';
import lifecycleStream from '../hoc/lifecycleStream';
import { groupListSelector, groupListForDropdownSelector } from '../selectors/groupSelector';
import { visibleAudios } from '../selectors/audioSelectors';
import SearchHighlight from '../components/SearchHighlight';
import { propContains } from '../utils/littleFn';

const { Column } = Table;

// const formatSec = sec => `${Math.floor(sec / 60)}:${sec % 60}`;
const ifElseValue = (pre, trueValue, falseValue) => (pre ? trueValue : falseValue);

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
    search = '',
  } = props;
  const isCurrentPlaying = audio =>
    currentPlaying ? R.eqProps('id', audio, currentPlaying) : false;

  return (
    <Table
      size="small"
      pagination={false}
      dataSource={audios}
      onRowDoubleClick={onAudioClick}
      rowClassName={row => ifElseValue(isCurrentPlaying(row), 'row-active', '')}
      rowKey={row => row.id}
    >
      <Column
        width={50}
        render={(text, record, index) => (
          <span>
            {ifElseValue(
              isCurrentPlaying(record),
              <i className="material-icons" style={{ color: 'red' }}>
                volume_up
              </i>,
              <span style={{ marginLeft: 4 }}>{index < 9 ? `0${index + 1}` : index + 1}</span>,
            )}
          </span>
        )}
      />
      <Column
        width={22}
        render={(text, record) => (
          <span>
            {ifElseValue(
              R.path(['groups', 'favorite'], record),
              <i
                className="material-icons"
                style={{ color: 'red' }}
                onClick={() => removeAudioFromFavorite(record)}
              >
                favorite
              </i>,
              <i className="material-icons" onClick={() => addAudioToFavorite(record)}>
                favorite_border
              </i>,
            )}
          </span>
        )}
      />

      <Column
        title="Title"
        dataIndex="title"
        width="50%"
        render={(text, record) => (
          <SearchHighlight search={search} value={record.title || record.name} />
        )}
      />
      <Column
        title="Artist"
        dataIndex="artist"
        width={170}
        render={(text, record) => <SearchHighlight search={search} value={record.artist} />}
      />
      <Column
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
              <i className="material-icons">playlist_add</i>
            </Popover>
          </span>
        )}
      />
      <Column
        render={(text, record) => (
          <i
            className="material-icons"
            onClick={() => openInFolderClick(record)}
            style={{ marginRight: 10 }}
          >
            folder
          </i>
        )}
      />
      <Column
        render={(text, record) => (
          <i className="material-icons" onClick={() => removeAudio(record)}>
            delete
          </i>
        )}
      />
    </Table>
  );
};

class AudioListLazy extends React.Component {
  state = { search: '', loadedAll: false, visibleCount: 5, perPage: 6 };
  changeSearch = value => this.setState({ search: value });

  componentWillReceiveProps(nextProps) {
    console.log(this.props.audios.length, nextProps.audios.length);
    if (this.props.audios.length !== nextProps.audios.length) {
      console.log('reset state, !!!!!!!!!');
      this.setState({
        loadedAll: false,
        visibleCount: 5,
      });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    setTimeout(() => {
      const { isVisible, loadedAll } = this.state;
      if (!loadedAll && isVisible) {
        this.loadMore();
      }
    }, 300);
  };

  onVisibleChange = isVisible => {
    this.setState({
      isVisible,
    });
    if (isVisible) {
      console.log('can see it, load more');
      this.loadMore();
    } else {
      console.log('cannot see nothing');
    }
  };

  loadMore = () => {
    const { perPage, visibleCount } = this.state;
    const { audios } = this.props;
    if (visibleCount >= audios.length) {
      console.log('all loaded');
      this.setState({
        loadedAll: true,
      });
      return;
    }
    let newCount = visibleCount + perPage;
    if (newCount > audios.length) {
      newCount = audios.length;
    }
    this.setState({
      visibleCount: newCount,
    });
  };

  render() {
    const { changeSearch } = this;
    const { search, visibleCount } = this.state;
    const { audios, ...rest } = this.props;
    const filtered = R.filter(propContains(search, ['title', 'name']), audios);
    // const displayAudios = filtered.slice(0, visibleCount);
    return (
      <div>
        <Input value={search} onChange={e => changeSearch(e.target.value)} />
        <AudioList audios={filtered} {...rest} search={search} />
        <VisibilitySensor onChange={this.onVisibleChange} />
        <div style={{ marginBottom: 20 }} />
      </div>
    );
  }
}

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
)(AudioListLazy);

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
    const { audios, removeAllAudio, resetAudioState } = this.props;
    return (
      <div>
        <AudioListWithDefault audios={audios} />
        <Button onClick={this.addAudios}>Add Audio</Button>
        <Button onClick={removeAllAudio}>Remove ALL</Button>
        <Button onClick={resetAudioState}>Reset Audio State</Button>
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
    resetAudioState: () => dispatch(actions.resetAudioState()),
  }),
)(AudioListContainer);
