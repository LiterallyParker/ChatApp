const { ChatroomUser } = require("../models");

const ERROR_MESSAGES = {
    missingFields: "Please supply required fields.",
    emailMismatch: "Emails do not match.",
    passwordLength: "Password must contain at least 10 characters.",
    invalidPassword: "Password must contain at least 1 capital letter. (X, Y, Z)",
    passwordMismatch: "Passwords do not match.",
    invalidSaltRounds: "Invalid salt rounds value in environment.",
    invalidEmail: "Invalid Email.",
    updateFieldsError: "No fields to update.",
    emailInUse: "Email already in use.",
    usernameInUse: "Username already in use.",
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
    login: "Error logging in user.",
    authorization: "Error with authorization.",
    invalidChatroom: "Invalid Chatroom type.",
    creatingChatroom: "Error creating chatroom.",
    deletingChatroom: "Error deleting chatroom.",
    chatroomNotFound: "Chatroom not found.",
    chatroomPermissions: "User does not have permissions in this chatroom.",
    changingChatroomName: "Error while changing chatroom name.",
    unauthorized: "User is unauthorized.",
    userInChatroom: "User is already in this chatroom.",
    userNotInChatroom: "User is not in this chatroom.",
    newChatroomUser: "Error while adding user to chatroom.",
    removingChatroomUser: "Error while removing user from chatroom.",
    invalidChatroomName: "Please enter a valid name.",
    sameChatroomName: "Old name and new name are the same.",
    passwordLength: "Password must contain at least 8 charaters.",
    passwordCapital: "Password must contain at least 1 capital letter.",
    passwordNumber: "Password must contain at least 1 number.",
    passwordSpecialChars: "Password must contain at least 1 of the following: ! @ # $ % _",
    userNotFound: "User not found.",
    addingMessage: "Error while adding message.",
    removingMessage: "Error while removing message.",
    messageNotFound: "Message not found.",
    chatroomOwnerOnly: "Only chatroom owners can do this.",
    getMessages: "Error while fetching messages.",
    privateChatroom: "This is a private chatroom.",
    updatingUsername: "Error while updating username.",
    updatingEmail: "Error while updating email.",
    updatingName: "Error while updating name.",
    sameFirstName: "First name is the same as previous.",
    sameLastName: "Last name is the same as previous.",
    sameUsername: "Username is the same as previous.",
    invalidParameter: "1 or more parameters are invalid.",
    notLoggedIn: "User must be logged in to perform this action.",
    samePassword: "New password must be different from the last password.",
    conflictingChatroomName: "A chatroom with that name already exists.",
    unknownRoute: "Route does not exist.",
    emptyMessage: "Cannot submit an empty message.",
    fetchingChatroomUsers: "Error while fetching this chatroom's users.",
    chatroomUsersNotFound: "Chatroom Users not found.",
};

const errorResponse = (name, message = "There was an error :(") => ({
    error: true,
    name: name + "Error",
    message
});

const successResponse = (data = null) => ({
    error: false,
    data
});

const validatePassword = (password) => {
    const specialChars = ["!", "@", "#", "$", "%", "_"];
    const chars = password.split("");

    if (!password || password.length < 8) {
        return errorResponse("PasswordValidation", ERROR_MESSAGES.passwordLength);
    };

    if (!chars.some(char => char >= 'A' && char <= 'Z')) {
        return errorResponse("PasswordValidation", ERROR_MESSAGES.passwordCapital);
    };

    if (!chars.some(char => char >= '0' && char <= '9')) {
        return errorResponse("PasswordValidation", ERROR_MESSAGES.passwordNumber);
    };

    if (!chars.some(char => specialChars.includes(char))) {
        return errorResponse("PasswordValidation", ERROR_MESSAGES.passwordSpecialChars);
    };

    return successResponse()
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return errorResponse("InvalidEmail", ERROR_MESSAGES.invalidEmail);
    };

    return { error: false };
};

const validatePrivateChatroom = async ( chatroomId, userId ) => {
    // Return true or false depending on whether the user with id: userId is an included member in the chatroomUsers table or not
    try {
        const chatroomUser = await ChatroomUser.findOne({
            where: {
                chatroomId,
                userId
            }
        });

        return chatroomUser !== null;
    } catch (error) {
        console.error("Error validating user against chatroom:", error);
        return errorResponse("ValidatePrivateChatroom");
    }
}

module.exports = {
    ERROR_MESSAGES,
    errorResponse,
    successResponse,
    validatePassword,
    validateEmail,
    validatePrivateChatroom
};