import createUUID from '../utils/createUUID';

const initialState = {
  playLists: [],
  activePlayListId: null,
};

export const ADD_PLAYLIST = 'ADD_PLAYLIST';
export const REMOVE_PLAYLIST = 'REMOVE_PLAYLIST';
export const SET_ACTIVE_PLAYLIST_ID = 'SET_ACTIVE_PLAYLIST_ID';
export const SET_DEFAULT_PLAYLIST_ACTIVE = 'SET_DEFAULT_PLAYLIST_ACTIVE';
export const DEFAULT_PLAYLIST_ID = 'DEFAULT_PLAYLIST_ID';

const addPlayList = name => ({
  type: ADD_PLAYLIST,
  payload: name,
});

const removePlayList = id => ({
  type: REMOVE_PLAYLIST,
  payload: id,
});

const setActivePlayListId = id => ({
  type: SET_ACTIVE_PLAYLIST_ID,
  payload: id,
});

const setDefaultPlayListActive = () => ({
  type: SET_DEFAULT_PLAYLIST_ACTIVE,
});

export const actions = {
  addPlayList,
  removePlayList,
  setActivePlayListId,
  setDefaultPlayListActive,
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
  [SET_ACTIVE_PLAYLIST_ID]: (state, action) => ({
    ...state,
    activePlayListId: action.id,
  }),
  [SET_DEFAULT_PLAYLIST_ACTIVE]: state => ({
    ...state,
    activePlayListId: DEFAULT_PLAYLIST_ID,
  }),
};

const playListReducer = (state = initialState, action) => {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default playListReducer;
