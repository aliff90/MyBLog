import axios from "axios";
import { LOGOUT_USER } from "../actions/types";
import store from "../store";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json"
    }
});

/**
 intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
**/

api.interceptors.response.use(
    res => res,
    err => {
      if (err.response.status === 401) {
        store.dispatch({ type: LOGOUT_USER });
      }
      return Promise.reject(err);
    }
  );
export default api;
