//function takes state and action
/* state is array of objects
  {
    id: 1,
    msg: 'Please log in',
    alertType: 'success',
  },

  We recieve the state and array from the alert action and set it into the array


*/

import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action; //take out type and payload from action
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    // sets the state when called, adds to the existing payload
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    // removes the payload which is passed from the existing state objects
    // ie filters out the state array of the passes value
    default:
      return state;
  }
}
