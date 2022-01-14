import { combineReducers } from 'redux';
import alert from './alert';

const rootReducer = combineReducers({ alert });

// takes a object that has any no of reducers we create
export default rootReducer;
