const express = require("express");
const router = express.Router();
const config = require("config");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", [
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password must be more than 6 characters").isLength({ min: 6 }),
    check("email", "Must be a valid email").isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json("User already exists");
        };

        // Create user
        user = new User({
            name,
            email,
            password
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // jwt
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 360000 }, (err, token) => {
            if (err) throw (err);
            res.json({ token });
        })

    } catch (error) {
        console.error("Cannot create user", error);
        res.status(500).send("Server error")
    }

});

module.exports = router;