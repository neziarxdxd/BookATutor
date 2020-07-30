import axios from 'axios';

// Create Message
export const createMessage = (bookingDetails) => dispatch => {
    axios.post('/api/message', bookingDetails)
        .then(res => console.log(res))
        .catch(err => console.error(err));
}
