import api from "../utils/api";
import { REGISTER_USER, LOGIN_USER, LOAD_USER, LOGOUT_USER } from './types';
import {setErrors} from "./errors";

//Load User
export const loadUser = () => async dispatch => {
    try {
        const res = await api.get("/auth");

        dispatch({
            type: LOAD_USER,
            payload: res.data
        })
    } catch (error) {
        console.log(error)
    }
}

// Register User
export const register = (formData) => async dispatch => {

    try {
        const res = await api.post("/users", formData);

        dispatch ({
        type: REGISTER_USER,
        payload: res.data
        });

        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors

        dispatch(setErrors(errors))

        console.log("Error", error.response)
    }
}

// Login User
export const login = ( email, password ) => async dispatch => {
    const body = { email, password }

    try {
        // const res = await axios.post("http://localhost:3000/auth", body);
        const res = await api.post("/auth", body);


        dispatch ({
        type: LOGIN_USER,
        payload: res.data
        });

        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors

        dispatch(setErrors(errors))

        console.log("help", error.response.data.errors)
    }
};

// Logout User
export const logout = () => async dispatch => {
    try {
        dispatch({
            type: LOGOUT_USER
        })
    } catch (error) {
        
    }
}

