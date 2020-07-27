import axios from 'axios';
import { 
    GET_STUDENT_PROFILE, 
    PROFILE_LOADING
} 
from './types';

// Get current profile
export const getStudentProfile = () => dispatch => {
    dispatch(setProfileLoading());
    axios.get('/api/profile/student-profile')
        .then(res => 
            dispatch({
                type: GET_STUDENT_PROFILE,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_STUDENT_PROFILE,
                payload: {}
            })
        );
}

// Profile loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    };
}
