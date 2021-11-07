const express = require("express");
const router = express.Router();
const config = require("config");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(404).send("Not found");

    }
})

router.post("/", [
    check("password", "Must be more than 6 characters").isLength({ min: 6 }),
    check("email", "Must be a valid email").isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
        };

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
        }

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

