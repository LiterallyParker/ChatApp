require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { ERROR_MESSAGES, errorResponse } = require("../util");
const { User } = require('../models');
const { getUserById } = require("../controllers/user");

const generateJWT = (payload) => {
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
        return token;
    } catch (error) {
        console.error("Error generating JWT:", error);
        return null;
    };
};

const generateEmailToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

const addUserToReq = async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    // if no auth Header is present
    if (!auth) {
        next();

    } else if (auth.startsWith(prefix)) {
        // slice off "Bearer "
        const token = auth.slice(prefix.length);

        if (!token) {
            next();
        };

        try {

            const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
            const { id } = verifiedToken;
            console.log(id);

            if (id) {
                req.user = await User.findByPk(id, {
                    attributes: ["id", "firstName", "lastName", "email", "username"]
                });
                next();
            };

        } catch (error) {
            next(error);
        };

    } else {
        next({
            error: true,
            message: `Authorization token must start with ${prefix}`
        });
    };
};

const requireUser = async (req, res, next) => {
    if (!req.user) {
        res.status(401).json(errorResponse("Authorization", ERROR_MESSAGES.notLoggedIn));
    };
    next();
};

module.exports = {
    generateJWT,
    generateEmailToken,
    addUserToReq,
    requireUser
};