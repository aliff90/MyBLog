import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/route/PrivateRoute";

// Component
import Logo from "./components/Logo";
import Navbar from "./components/navbar/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PostContent from "./components/posts/PostContent";
import PostForm from "./components/posts/PostForm";
import EditForm from "./components/posts/EditForm";
import About from "./components/profile/About";
import Contact from "./components/Contact";
import Footer from "./components/footer/Footer";

// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import { LOGOUT_USER } from "./actions/types";
import setAuthToken from "./utils/setAuthToken";
import styles from "./components/styles/styles.scss";

const App = () => {
  useEffect(() => {

    if(localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());

    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT_USER });
    });
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Logo />
        <Navbar />
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/posts/:id" component={PostContent} />
          <PrivateRoute exact path="/form" component={PostForm} />
          <PrivateRoute exact path="/edit/:id" component={EditForm} />
          <Route exact path="/about" component={About} />
          <Route exact path="/contact" component={Contact} />
          </Switch>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
