const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");

module.exports = function(req, res, next){
    // Get token from header
    const token = req.header("x-auth-token");

    if(!token) {
        return res.status(401).json({ msg: "No token, authorization denied"})
    }

    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));

        req.user = decoded.user;
        next()
    } catch (error) {
        res.status(401).json({ msg: "Token us not valid" });
    }
};

