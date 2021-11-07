import api from "../utils/api";
import { setErrors } from "./errors";
import { GET_POSTS, GET_POST, ADD_POST, DELETE_POST, UPDATE_POST, ADD_COMMENT, DELETE_COMMENT, UPDATE_LIKES } from "./types";

export const getPosts = (pageNo) => async dispatch => {
    const res = await api.get(`/posts?page=${pageNo}`);
    // console.log(res.data)

    try {
        dispatch({
            type: GET_POSTS,
            payload: res.data
        });
    } catch (error) {
        const errors = error.response.data.errors

        dispatch(setErrors(errors))
        console.log(error);
    }
}

export const getPost = (id) => async dispatch => {
    try {
        const res = await api.get(`/posts/${id}`);
        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (error) {
        console.log(error)
    }
}

export const addPost = (formData) => async dispatch => {
    try {
        // const res = await api.post("/upload", file)
        const res = await api.post("/posts", formData);
        console.log(res.data)

        dispatch({
            type: ADD_POST,
            payload: res.data
        })
    } catch (error) {
        const errors = error.response.data.errors

        dispatch(setErrors(errors))
        console.log(error)
    }
}

export const deletePost = (id) => async dispatch => {
    try {
        await api.delete(`/posts/${id}`);

        dispatch({
            type: DELETE_POST,
            payload: id
        })

    } catch (error) {
        const errors = error.response.data.errors

        dispatch(setErrors(errors))
        console.log(error)
    }
}

export const updatePost = (id, post) =>  async dispatch => {
    try {
        const res = await api.put(`/posts/${id}`, post);
        // console.log(res.data)

        dispatch({
            type: UPDATE_POST,
            payload: res.data
        })

    } catch (error) {
        const errors = error.response.data.errors

        dispatch(setErrors(errors))
        console.log(error)
    }
};

export const addComment = (id, comment) => async dispatch => {
    try {
        const res = await api.post(`/posts/comment/${id}`, comment);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })
    } catch (error) {
        const errors = error.response.data.errors

        dispatch(setErrors(errors))
        console.log(error)
    }
}

export const deleteComment = (id, commentId) => async dispatch => {
    try {
        await api.delete(`/posts/comment/${id}/${commentId}`);

        dispatch({
            type: DELETE_COMMENT,
            payload: commentId
        })
    } catch (error) {
        const errors = error.response.data.errors

        dispatch(setErrors(errors))
        console.log(error)
    }
}

// Add like
export const addLike = id => async dispatch => {
    try {
      const res = await api.put(`/posts/like/${id}`);
      
  
      dispatch({
        type: UPDATE_LIKES,
        payload: { id, likes: res.data }
      });
    } catch (error) {
        // const errors = error.response.data.errors
        const errors = ["Error"]

        dispatch(setErrors(errors))
        console.log(error)
    }
  };
  
  // Remove like
  export const removeLike = id => async dispatch => {
    try {
      const res = await api.put(`/posts/unlike/${id}`);
  
      dispatch({
        type: UPDATE_LIKES,
        payload: { id, likes: res.data }
      });
    } catch (error) {
        // const errors = error.response.data.errors
        const errors = ["Error"]

        dispatch(setErrors(errors))
        console.log(error)
    }
  };