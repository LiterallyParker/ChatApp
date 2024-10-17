require("dotenv").config();
const { Op } = require('sequelize')
const db = require("../models");
const bcrypt = require("bcrypt");
const User = db.User;
const { formatErrorResponse, generateToken, validateEmail } = require("../util")

const REQUIRED_FIELDS = ["username", "password", "email", "confirmedEmail", "confirmedPassword"];
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
    updatingPassword: "Error updating password."
};

const addUser = async (userData) => {

    const { firstName, lastName, username, email, confirmedEmail, password, confirmedPassword } = userData;
    const nameSupplied = firstName && lastName;

    for (const field of REQUIRED_FIELDS) {
        if (!userData[field]) {
            return formatErrorResponse("AddUser", ERROR_MESSAGES.missingFields)
        };
    };

    if (email !== confirmedEmail) {
        return formatErrorResponse("AddUser", ERROR_MESSAGES.emailMismatch);
    };

    const emailValidation = validateEmail(email);
    if (emailValidation.error) {
        return emailValidation;
    }

    if (password.length < 10 || !/[A-Z]/.test(password)) {
        return formatErrorResponse("AddUser", ERROR_MESSAGES.invalidPassword);
    };

    if (password !== confirmedPassword) {
        return formatErrorResponse("AddUser", ERROR_MESSAGES.passwordMismatch);
    };

    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return formatErrorResponse("AddUser", ERROR_MESSAGES.duplicateEmail);
            };
            if (existingUser.username === username) {
                return formatErrorResponse("AddUser", ERROR_MESSAGES.duplicateUsername);
            };
        };

        const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10)

        if (isNaN(SALT_ROUNDS) || SALT_ROUNDS <= 0) {
            return formatErrorResponse("AddUser", ERROR_MESSAGES.invalidSaltRounds);
        };

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const verificationToken = generateToken();

        const newUser = await User.create({
            firstName: !nameSupplied ? "Guest" : firstName,
            lastName: !nameSupplied ? "User" : lastName,
            username,
            email,
            role: "NUSR",
            hash: hashedPassword,
            verificationToken,
            verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)  // Token valid for 24 hours
        });

        return {
            error: false,
            data: {
                newUser
            }
        };

    } catch (error) {
        console.error("Error adding user:", error);
        return formatErrorResponse("AddUser", ERROR_MESSAGES.addingUser)
    };
};

const getUsersByPagination = async (chunkIndex, chunkSize) => {

    if (chunkIndex < 0 || chunkSize <= 0) {
        return formatErrorResponse("FetchUsers", ERROR_MESSAGES.pagination)
    };

    try {
        const offset = chunkIndex * chunkSize;
        const users = await User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
            limit: chunkSize,
            offset: offset
        });
        const totalCount = await User.count();

        if (!users.length) {
            return formatErrorResponse("FetchUsers", ERROR_MESSAGES.pagination)
        }
        
        return {
            error: false,
            data: {
                users,
                totalCount,
                totalPages: Math.ceil(totalCount / chunkSize)
            }
        };

    } catch (error) {
        console.error(error);
        return formatErrorResponse("FetchUsers", ERROR_MESSAGES.fetchingUsers);
    };
};

const getUserById = async (id) => {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return formatErrorResponse("FetchUser", ERROR_MESSAGES.fetchingUser);
        }
        return {
            error: false,
            data: user
        };
    } catch (error) {
        console.error(`Error finding User#${id}:`, error);
        return formatErrorResponse("FetchUser", ERROR_MESSAGES.fetchingUser);
    };
};

const deleteUser = async (id) => {
    try {
        const result = await User.destroy({
            where: { id: id }
        });

        if (result === 0) {
            return formatErrorResponse("DeleteUser", `Error deleting User#${id}.`);
        };

        return { error: false, data: { message: "User deleted successfully." } };
    } catch (error) {
        console.error(`Error deleting User#${id}:`, error);
        return formatErrorResponse("DeleteUser", ERROR_MESSAGES.deletingUser);
    };
};

const updateUser = async (id, params = {}) => {
    try {
        const existingUser = await User.findByPk(id);
        if (!existingUser) {
            return formatErrorResponse("UpdateUser", `User#${id} does not exist.`)
        };

        const { email, username } = req.params;
        let conflictingUser;

        if (email || username) {
            conflictingUser = await User.findOne({
                where: {
                    [Op.or]: [
                        { email: email || null },
                        { username: username || null }
                    ],
                    id: { [Op.ne]: id }
                }
            });
        };

        if (conflictingUser) {
            if (conflictingUser.email === email) {
                return formatErrorResponse("UpdateUser", ERROR_MESSAGES.duplicateEmail);
            };
            if (conflictingUser.username === username) {
                return formatErrorResponse("UpdateUser", ERROR_MESSAGES.duplicateUsername);
            };
        };

        if (email) {
            validateEmail(email);
        }

        delete params.password;
        delete params.role;

        const [updatedRows] = await User.update(params, {
            where: { id: id }
        });

        if (updatedRows === 0) {
            return formatErrorResponse("UpdateUser", ERROR_MESSAGES.updatingUser)
        };

        const updatedUser = await User.findByPk(id);
        return {
            error: false,
            data: {
                updatedUser
            }
        };

    } catch (error) {
        console.error(`Error updating User#${id}:`, error);
        return formatErrorResponse("UpdateUser", ERROR_MESSAGES.updatingUser)
    };
};

const updatePassword = async (id, oldPassword, newPassword, confirmedNewPassword) => {

    if (newPassword !== confirmedNewPassword) {
        return formatErrorResponse("UpdatePassword", ERROR_MESSAGES.passwordMismatch);
    };

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return formatErrorResponse("UpdatePassword", ERROR_MESSAGES.fetchingUser);
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.hash);
        if (!passwordMatch) {
            return formatErrorResponse("UpdatePassword", ERROR_MESSAGES.incorrectPassword)
        }

        if (newPassword.length < 10 || !/[A-Z]/.test(newPassword)) {
            return formatErrorResponse("UpdatePassword", ERROR_MESSAGES.invalidPassword)
        }

        const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

        user.hash = hashedPassword;
        await user.save();

        return { error: false, data: { message: "Password Updated Successfully." } };

    } catch (error) {
        console.error(`Error updating password for User#${id}:`, error);
        return formatErrorResponse("UpdatePassword", ERROR_MESSAGES.updatingPassword)
    }
}

module.exports = {
    getUsersByPagination,
    getUserById,
    deleteUser,
    updateUser,
    addUser,
    updatePassword
};