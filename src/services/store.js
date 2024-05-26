let state = {};

const getState = () => state;

const setState = (newState) => {
  state = { ...newState };
};

const init = (initialState) => {
  setState(initialState);
};

export default { init, getState, setState };
