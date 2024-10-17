const crypto = require("crypto");

const formatErrorResponse = (name, message) => ({
    error: true,
    name: name + "Error",
    message
})

const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
}

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return formatErrorResponse("InvalidEmail", ERROR_MESSAGES.invalidEmail)
    }

    return { error: false };
};

module.exports = {
    formatErrorResponse,
    generateToken,
    validateEmail
}