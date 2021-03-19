import { GETTOKEN2 } from '../constants/actionTypes';

const forgeReducer = (state = { forgeToken: null }, action) => {
  switch (action.type) {
    case GETTOKEN2:
      // localStorage.setItem('token', JSON.stringify({ ...action?.payload }));
      return { ...state, forgeToken: action?.payload };
    default:
      return state;
  }
};

export default forgeReducer;
