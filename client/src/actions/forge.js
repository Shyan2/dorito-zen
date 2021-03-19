import * as api from '../api/index.js';
import { GETTOKEN2 } from '../constants/actionTypes';

export const getToken = () => async (dispatch) => {
  try {
    const { data } = await api.getForgeToken2();

    dispatch({ type: GETTOKEN2, payload: data });
  } catch (error) {
    console.log(error);
  }
};
