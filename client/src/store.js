import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers'; //fetching index.js so just go with the module export name ie rootReducer

const initialState = {};

const middleware = [thunk]; //thunk is a middleware

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
// passing middleware thunk to apply middleware
// createStore(root, state, anymiddleware)

export default store;
