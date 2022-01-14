import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

// this action is mapped to register component and once called from there we recieve the msg and alerttype
// then dispatch it to redux ie root reducer then it forwards to redux

// dispatch more than one action type from this fucntion so we all dispatch
// possible because of thunk
export const setAlert =
  (msg, alertType, timeout = 5000) =>
  (dispatch) => {
    const id = uuidv4();
    dispatch({
      type: SET_ALERT,
      payload: {
        msg,
        alertType,
        id,
      },
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };
