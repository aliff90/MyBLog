import { AUTH_ERRORS, REMOVE_ERRORS } from "../actions/types";
const initialState = []

export default function errorReducer(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
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
}

