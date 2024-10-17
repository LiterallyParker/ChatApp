require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

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
}

module.exports = {
    generateJWT,
    generateEmailToken
};