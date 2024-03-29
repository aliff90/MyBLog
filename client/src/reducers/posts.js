import { GET_POSTS, GET_POST, ADD_POST, DELETE_POST, UPDATE_POST, ADD_COMMENT, DELETE_COMMENT, AUTH_ERRORS, REMOVE_ERRORS, UPDATE_LIKES } from "../actions/types";

const initialState = {
    posts: [],
    post: "",
    loading: true,
    errors: [],
    totalPages: 0
}

function postReducer(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case GET_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false
            }
        case GET_POST:
            return {
                ...state,
                post: payload,
                loading: false
            }
        case ADD_POST:
            return {
                ...state,
                posts: [payload, ...state.posts.posts],
                loading: false
            }
        case UPDATE_POST:
            return {
                ...state,
                posts: state.posts.posts.map(post => (post._id === payload.id ? {payload: post} : post)),
                loading: false
            }
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.posts.filter((post) => post._id !== payload),
                loading: false
            }
        case ADD_COMMENT:
            return {
                ...state,
                post: {...state.post, comments: payload},
                loading: false
            }
        case DELETE_COMMENT: 
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: state.post.comments.filter((comment) => (
                        comment._id !== payload
                    ))
                }
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
        case UPDATE_LIKES:
            return {
              ...state,
              posts: state.posts.posts.map((post) =>
                post._id === payload.id ? { ...post, likes: payload.likes } : post
              ),
              loading: false
            }
        default: return state
    }
}

export default postReducer;