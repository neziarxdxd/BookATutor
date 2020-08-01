import axios from 'axios';
import { 
    MESSAGE_LOADING,
    GET_MESSAGES,
    CLEAR_MESSAGES
} 
from './types';


// Create Message
export const createMessage = (bookingDetails, history) => dispatch => {
    axios.post('/api/message', bookingDetails)
        .then(res => console.log(''))
        .catch(err => console.error(err));
}

// Get all messages of user
export const getMessages = (userId) => dispatch => {
    dispatch(setMessageLoading());
    axios
      .get(`/api/message/${userId}`)
      .then(res => {
            dispatch({
              type: GET_MESSAGES,
              payload: res.data
            })
        }
      )
      .catch(err =>
        dispatch({
          type: GET_MESSAGES,
          payload: null
        })
      );
}

// Clear messages
export const clearMessages = () => {
    return {
        type: CLEAR_MESSAGES
    };
}

// Message loading
export const setMessageLoading = () => {
    return {
        type: MESSAGE_LOADING
    };
}