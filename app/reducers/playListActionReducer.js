import createUUID from '../utils/createUUID';

const initialState = {
  playLists: [],
  activePlayList: { type: 'default', id: 'all' },
};

export const ADD_PLAYLIST = 'ADD_PLAYLIST';
export const REMOVE_PLAYLIST = 'REMOVE_PLAYLIST';
export const SET_PLAYLIST_ACTIVE = 'SET_PLAYLIST_ACTIVE';

const addPlayList = name => ({
  type: ADD_PLAYLIST,
  payload: name,
});

const removePlayList = id => ({
  type: REMOVE_PLAYLIST,
  payload: id,
});

const setActivePlaylist = playlist => ({
  type: SET_PLAYLIST_ACTIVE,
  payload: playlist,
});

export const actions = {
  addPlayList,
  removePlayList,
  setActivePlaylist,
};

const actionHandler = {
  [ADD_PLAYLIST]: (state, action) => ({
    ...state,
    playLists: [
      ...state.playLists,
      {
        id: createUUID(),
        name: action.payload,
      },
    ],
  }),
  [REMOVE_PLAYLIST]: (state, action) => ({
    ...state,
    playLists: state.playLists.filter(li => li.id !== action.payload),
  }),
  [SET_PLAYLIST_ACTIVE]: (state, action) => ({
    ...state,
    activePlayList: action.payload,
  }),
};

const playListReducer = (state = initialState, action) => {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default playListReducer;
