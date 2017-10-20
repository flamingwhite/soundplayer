import * as R from 'ramda';

const initialState = {
  globalLoading: false,
};

export const SET_GLOBAL_LOADING = 'SET_GLOBAL_LOADING';

const startGLobalLoading = () => ({
  type: SET_GLOBAL_LOADING,
  payload: true,
});

const stopGLobalLoading = () => ({
  type: SET_GLOBAL_LOADING,
  payload: false,
});

export const actions = {
  startGLobalLoading,
  stopGLobalLoading,
};

const actionHandler = {
  [SET_GLOBAL_LOADING]: (state, { payload }) => R.assoc('globalLoading', payload)(state),
};

const appStateReducer = (state = initialState, action) => {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
};

export default appStateReducer;
