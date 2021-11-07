import React,  { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { logout } from "../../actions/auth";

const Navbar = props => {
    const [show, setShow] = useState(false)

    const onOpen = () => {
        const change = !show;
        setShow(change);
    }

    const isAuthenticated = useSelector(state => state.authReducer.isAuthenticated);
    const dispatch = useDispatch();
    const logoutUser = () => {
        dispatch(logout());
    }

    const authLinks = (
        <div className="navbar">
            <div className="bars" onClick={onOpen}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
            <ul>
                <div className={show ? "nav actives" : "nav"} onClick={() => setShow(!show)}>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/form" className="btn" >Post</Link>
                    </li>
                    <li>
                        <Link to="/contact">Contact</Link>
                    </li>
                    <li>
                    <Link to="/" className="btn" onClick={logoutUser}>Logout</Link>
                </li>
                </div>
            </ul>
        </div>
    );

    const publicLinks = (
        <div className="navbar">
        <div className="bars" onClick={onOpen}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
        </div>
        <ul>
            <div className={show ? "nav actives" : "nav"} onClick={() => setShow(!show)}>
                <li>
                    <Link to="/" className="link">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/contact">Contact</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
            </div>
        </ul>
    </div>
    )

    return (
        <div>
            {isAuthenticated ? authLinks : publicLinks}

        </div>
    )
}

export default Navbar;
