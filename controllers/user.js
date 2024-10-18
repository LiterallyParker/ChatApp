require("dotenv").config();
const { Op } = require('sequelize');
const { User } = require("../models");
const bcrypt = require("bcrypt");

const {
    errorResponse,
    successResponse,
    validateEmail,
    validatePassword,
    ERROR_MESSAGES,
} = require("../util");

const {
    generateEmailToken,
    generateJWT
} = require("../auth");

const REQUIRED_FIELDS = ["username", "password", "email", "confirmedEmail", "confirmedPassword"];

const registerUser = async ( req, res ) => {

    const { firstName, lastName, username, email, confirmedEmail, password, confirmedPassword } = req.body;
    const nameSupplied = firstName && lastName;

    for (const field of REQUIRED_FIELDS) {
        if (!req.body[field]) {
            return res.status(400).json(errorResponse("AddUser", ERROR_MESSAGES.missingFields));
        };
    };

    if (email !== confirmedEmail) {
        return res.status(400).json(errorResponse("AddUser", ERROR_MESSAGES.emailMismatch));
    };

    const emailValidation = validateEmail(email);
    if (emailValidation.error) {
        return res.status(400).json(emailValidation);
    };

    const passwordValidation = validatePassword(password);
    if (passwordValidation.error) {
        return res.status(400).json(passwordValidation);
    };

    if (password !== confirmedPassword) {
        return res.status(400).json(errorResponse("AddUser", ERROR_MESSAGES.passwordMismatch));
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
                return res.status(400).json(errorResponse("AddUser", ERROR_MESSAGES.emailInUse));
            };
            if (existingUser.username === username) {
                return res.status(400).json(errorResponse("AddUser", ERROR_MESSAGES.usernameInUse));
            };
        };

        const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 4;

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const verificationToken = generateEmailToken();

        const newUser = await User.create({
            firstName: !nameSupplied ? "Guest" : firstName,
            lastName: !nameSupplied ? "User" : lastName,
            username,
            email,
            hash: hashedPassword,
            verificationToken,
            verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)  // Token valid for 24 hours
        });

        const tokenPayload = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username,
            email: newUser.email
        };

        const token = generateJWT(tokenPayload);

        return res.status(200).json(successResponse({
            message: "Registration successful.",
            token,
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                email: newUser.email
            }
        }));

    } catch (error) {
        console.error("Error adding user:", error);
        return res.status(500).json(errorResponse("AddUser", ERROR_MESSAGES.addingUser));
    };
};

const loginUser = async ( req, res ) => {
    const { identifier, password } = req.body;

    try {
        let user;
        if (validateEmail(identifier).error) {
            user = await User.findOne({ where: { username: identifier } });
        } else {
            user = await User.findOne({ where: { email: identifier } });
        };

        if (!user) {
            return res.status(400).json(errorResponse("LoginUser", ERROR_MESSAGES.invalidCredentials));
        };

        const passwordMatch = await bcrypt.compare(password, user.hash);
        if (!passwordMatch) {
            return res.status(400).json(errorResponse("LoginUser", ERROR_MESSAGES.invalidCredentials));
        };

        const tokenPayload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email
        };

        const token = generateJWT(tokenPayload);

        if (!token) {
            return res.status(500).json(errorResponse("LoginUser", ERROR_MESSAGES.JWTtoken));
        };

        return res.status(200).json(successResponse({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email
            }
        }));

    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json(errorResponse("LoginUser", ERROR_MESSAGES.fetchingUser));
    };
};

const getUsersByPagination = async ( req, res ) => {
    const chunkIndex = parseInt(req.query.chunkIndex) || 0;
    const limit = parseInt(req.query.chunkSize) || 10;
    const offset = chunkIndex * limit;

    if (chunkIndex < 0 || limit <= 0) {
        return res.status(500).json(errorResponse("FetchUsers", ERROR_MESSAGES.pagination));
    };

    try {
        const users = await User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
            limit,
            offset
        });
        const totalCount = await User.count();

        if (!users.length) {
            return res.status(500).json(errorResponse("FetchUsers", ERROR_MESSAGES.pagination));
        };

        return res.status(200).json(successResponse({
            users,
            totalCount,
            totalPages: Math.ceil(totalCount / limit)
        }));

    } catch (error) {
        console.error(error);
        return res.status(500).json(errorResponse("FetchUsers", ERROR_MESSAGES.fetchingUsers));
    };
};

const getUserById = async ( req, res ) => {
    const { userId } = req.params;
    if (isNaN(parseInt(userId))) {
        return res.status(400).json(errorResponse("FetchUser", ERROR_MESSAGES.invalidParameter));
    };

    try {
        const user = await User.findByPk(userId, {
            attributes: ["id", "firstName", "lastName", "username", "email"]
        });

        if (!user) {
            return res.status(500).json(errorResponse("FetchUser", ERROR_MESSAGES.userNotFound));
        };

        return res.status(200).json(successResponse({ user }));
    } catch (error) {
        console.error(`Error finding User#${userId}:`, error);
        return errorResponse("FetchUser", ERROR_MESSAGES.fetchingUser);
    };
};

module.exports = {
    getUsersByPagination,
    getUserById,
    registerUser,
    loginUser,
};