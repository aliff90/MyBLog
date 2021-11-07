import { REGISTER_USER, LOGIN_USER, LOAD_USER, LOGOUT_USER, AUTH_ERRORS, REMOVE_ERRORS } from "../actions/types";

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    errors: []
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case LOAD_USER:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            }
        case REGISTER_USER:
        case LOGIN_USER:
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
            }
        case LOGOUT_USER:
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: true,
                user: ""
            }
        case AUTH_ERRORS: {
            return {
                ...state,
                errors: [...state.errors, payload]
            }
        }
        case REMOVE_ERRORS:
            return {
                ...state,
                errors: []
            }
        default: return state
    }
};