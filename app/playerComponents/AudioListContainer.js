import React from 'react';
import { connect } from 'react-redux';
import { Button, Table, Icon, Divider } from 'antd';
import { localAudioPaths, openItemInFolder } from '../utils/getLocalFiles';
import { getNameByPath } from '../utils/audioUtil';
import { actions } from '../reducers/audioActionReducer';

const formatSec = sec => `${Math.floor(sec / 60)}:${sec % 60}`;

const { Column, ColumnGroup } = Table;

const AudioItem = props => {
  const { onAudioClick, audio, openInFolderClick, removeAudio } = props;

  return (
    <div style={{ padding: 4 }}>
      <span onClick={() => onAudioClick(audio)}>{audio.name}</span>
      <span onClick={() => openInFolderClick(audio)}> Open IN Finder</span>
      <span onClick={() => removeAudio(audio)}> Remove AUdio</span>
    </div>
  );
};

const AudioList = props => {
  const { list, onAudioClick, setLikeAudio, openInFolderClick, removeAudio } = props;
  return (
    <Table size="small" pagination={false} dataSource={list} onRowDoubleClick={onAudioClick}>
      <Column
        render={(text, record, index) => (
          <span>
            <span style={{ marginRight: 10 }}>{index < 9 ? `0${index + 1}` : index + 1}</span>
            {record.liked ? (
              <Icon
                type="heart"
                style={{ color: 'red' }}
                onClick={() => setLikeAudio(record, false)}
              />
            ) : (
              <Icon type="heart-o" onClick={() => setLikeAudio(record, true)} />
            )}
          </span>
        )}
      />
      <Column title="Title" dataIndex="title" width="60%" />
      <Column title="Artist" dataIndex="artist" width={200} />
      <Column
        title="Action"
        render={(text, record) => (
          <span>
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

class AudioListContainer extends React.Component {
  addAudios = () => {
    const { addMultipleAduios } = this.props;
    return localAudioPaths().then(paths =>
      addMultipleAduios(
        paths.map(p => ({
          path: p,
          name: getNameByPath(p),
        })),
      ),
    );
  };

  render() {
    const {
      audios,
      currentPlaying,
      setCurrentPlayingAudio,
      setLikeAudio,
      removeAudio,
      removeAllAudio,
    } = this.props;
    return (
      <div>
        {/* {audios.map(au => (
          <AudioItem
            audio={au}
            onAudioClick={setCurrentPlayingAudio}
            openInFolderClick={audio => openItemInFolder(audio.path)}
            removeAudio={removeAudio}
          />
		))}  */}
        <AudioList
          currentPlaying={currentPlaying}
          onAudioClick={setCurrentPlayingAudio}
          setLikeAudio={setLikeAudio}
          openInFolderClick={audio => openItemInFolder(audio.path)}
          removeAudio={removeAudio}
          list={audios}
        />
        <Button onClick={this.addAudios}>Add Audio</Button>
        <Button onClick={removeAllAudio}>Remove ALL</Button>
      </div>
    );
  }
}

const getVisibleAudios = state => {
  const { audioChunk } = state;
  const { audios = [] } = audioChunk;
  const { activePlayList } = state.playlistChunk;
  const { type, id } = activePlayList;

  if (type === 'custom') {
  } else if (id === 'favorite') {
    return audios.filter(au => au.liked);
  } else return audios;
};

export default connect(
  state => ({
    audios: getVisibleAudios(state),
    currentPlaying: state.audioChunk.currentPlaying,
  }),
  dispatch => ({
    addAudio: audio => dispatch(actions.addAudio(audio)),
    addMultipleAduios: audios => dispatch(actions.addMultipleAudios(audios)),
    setLikeAudio: (audio, newLike) => dispatch(actions.setLikeAudio(audio.path, newLike)),
    removeAudio: audio => dispatch(actions.removeAudio(audio.path)),
    removeAllAudio: () => dispatch(actions.removeAllAudio()),
    setCurrentPlayingAudio: audio => dispatch(actions.setCurrentPlaying(audio)),
  }),
)(AudioListContainer);
