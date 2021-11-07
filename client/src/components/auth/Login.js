import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import PropTypes from 'prop-types'
import { login } from '../../actions/auth';


const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const isAuthenticated = useSelector(state => state.authReducer.isAuthenticated);
    const errors = useSelector(state => state.authReducer.errors);
    const dispatch = useDispatch();
    // console.log(errors.map(error => error.msg))

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = e => {
        e.preventDefault();
        dispatch(login( email, password ));
    }

    if(isAuthenticated) {
        return <Redirect to="/" />
    }

    return (
        <div className="background">
        <div className="login-container">
            <div className="login-content">
                <h1 className="login-title">Login</h1>
                <form onSubmit={onSubmit}>
                    <div className="login-content__forms">
                        <div className="input-content">
                            <input type="email" name="email" placeholder="Email" value={email} onChange={e => onChange(e)} />
                        </div>
                        <div className="input-content">
                            <input type="password" name="password" placeholder="Password" value={password} onChange={e => onChange(e)} />
                        </div>
                        {errors && errors.map((error, i) => (
                            <div className="errors" key={i}>{error.msg}</div>
                        ))}
                        <button>Login</button>
                    </div>
                </form>
                <span>Or click <Link to="/register" className="link">here</Link> to sign up</span>
            </div>
        </div>
        </div>
    )
}

Login.propTypes = {
    isAuthenticated: PropTypes.bool
}

export default Login;
