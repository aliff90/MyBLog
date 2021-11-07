import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { register } from '../../actions/auth';

const Register = (props) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });


    const isAuthenticated = useSelector(state => state.authReducer.isAuthenticated);
    const errors = useSelector(state => state.authReducer.errors);
    console.log()
    const dispatch = useDispatch()

    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = e => {
        e.preventDefault();
        dispatch(register( {name, email, password} ))
    }


    if(isAuthenticated) {
        return <Redirect to="/" />
    }

    return (
        <div className="login-container">
            <div className="login-content">
                <h1 className="login-title">Register</h1>
                <form onSubmit={onSubmit}>
                    <div className="login-content__forms">
                        <div className="input-content">
                            <input type="text" name="name" placeholder="Name" value={name} onChange={e => onChange(e)} />
                        </div>
                        <div className="input-content">
                            <input type="email" name="email" placeholder="Email" value={email} onChange={e => onChange(e)} />
                        </div>
                        <div className="input-content">
                            <input type="password" name="password" placeholder="Password" value={password} onChange={e => onChange(e)} />
                        </div>
                        {errors && errors.map((error, i) => (
                            <div className="errors" key={i}>{error.msg}</div>
                        ))}
                        <button>Register</button>
                    </div>
                </form>
                <span>Already have an account? Click <Link to="/login" className="link">here</Link> to log in</span>
            </div>
        </div>
    )
}

Register.propTypes = {
    // isAuthenticated: PropTypes.bool
}

export default Register;
