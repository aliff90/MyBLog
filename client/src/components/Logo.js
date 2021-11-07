import Reac from "react"
import {Link } from "react-router-dom"


const Logo = () => {
    return (
        <div className="logo">
            <div className="logo-name">
                <Link to="/">My Blog</Link>
            </div>
        </div>
    )
}

export default Logo;