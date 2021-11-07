import { AUTH_ERRORS, REMOVE_ERRORS } from "./types";

export const setErrors = (errors) => dispatch => {
        errors.forEach(error => dispatch({
            type: AUTH_ERRORS,
            payload: error
        }))
    
    setTimeout(() => {
        dispatch({
            type: REMOVE_ERRORS
        })
    }, 3000)
};

