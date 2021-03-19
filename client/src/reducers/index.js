import { combineReducers } from 'redux';

import forge from './forge';
import auth from './auth';

export const reducers = combineReducers({ forge, auth });
