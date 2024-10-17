const ERROR_MESSAGES = {
    missingFields: "Please supply required fields.",
    emailMismatch: "Emails do not match.",
    passwordLength: "Password must contain at least 10 characters.",
    invalidPassword: "Password must contain at least 1 capital letter. (X, Y, Z)",
    passwordMismatch: "Passwords do not match.",
    invalidSaltRounds: "Invalid salt rounds value in environment.",
    invalidEmail: "Invalid Email.",
    updateFieldsError: "No fields to update.",
    duplicateEmail: "Email already in use.",
    duplicateUsername: "Username already in use.",
    addingUser: "Error adding new user.",
    fetchingUsers: "Error fetching users.",
    pagination: "Error with Pagination.",
    fetchingUser: "Error fetching user.",
    deletingUser: "Error deleting user.",
    updatingUser: "Error updating user.",
    incorrectPassword: "Old password is incorrect.",
    updatingPassword: "Error updating password.",
    invalidCredentials: "Incorrect username/email/password.",
    JWTtoken: "Error generating JWT.",
    registration: "Error registering user.",
    login: "Error logging in user."
};

const formatErrorResponse = (name, message) => ({
    error: true,
    name: name + "Error",
    message
})

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return formatErrorResponse("InvalidEmail", ERROR_MESSAGES.invalidEmail)
    }

    return { error: false };
};

module.exports = {
    ERROR_MESSAGES,
    formatErrorResponse,
    validateEmail
}