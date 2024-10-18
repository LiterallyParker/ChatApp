require('dotenv').config();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const {
    errorResponse,
    successResponse,
    validateEmail,
    validatePassword,
    ERROR_MESSAGES,
} = require('../util');

const deleteUser = async ( req, res ) => {
    const { userId } = req.params;

    try {
        const result = await User.destroy({
            where: { id: userId }
        });

        if (result === 0) {
            return res.status(400).json(errorResponse("DeleteUser", ERROR_MESSAGES.userNotFound));
        };

        return res.status(200).json(successResponse({ message: "User deleted successfully." }));
    } catch (error) {
        console.error(`Error deleting User#${userId}:`, error);
        return res.status(500).json(errorResponse("DeleteUser", ERROR_MESSAGES.deletingUser));
    };
};

const updateName = async ( req, res ) => {
    const { id: userId } = req.user;
    const { firstname, lastname } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json(errorResponse("UpdateName", ERROR_MESSAGES.userNotFound));
        };

        if (firstname === user.firstname) {
            return res.status(400).json(errorResponse("UpdateName", ERROR_MESSAGES.sameFirstName));
        };
        if (lastname === user.lastname) {
            return res.status(400).json(errorResponse("UpdateName", ERROR_MESSAGES.sameLastName));
        };

        if (firstname) {
            user.firstname = firstname;
        }
        if (lastname) {
            user.lastName = lastname;
        }

        await user.save();
        
        return res.status(200).json(successResponse({ message: "Name updated successfully." }));

    } catch (error) {
        console.error("Error updating name:", error);
        return res.status(500).json(errorResponse("UpdateName", ERROR_MESSAGES.updatingName));
    };
};

const updateUsername = async ( req, res ) => {
    const { id: userId } = req.user;
    const { username } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json(errorResponse("UpdateUsername", ERROR_MESSAGES.userNotFound));
        };
        if (username === user.username) {
            return res.status(400).json(errorResponse("UpdateUsername", ERROR_MESSAGES.sameUsername))
        }

        const conflictingUser = await User.findOne({
            where: {
                username
            }
        });

        if (conflictingUser) {
            return res.status(400).json(errorResponse("UpdateUsername", ERROR_MESSAGES.usernameInUse))
        };

        user.username = username;
        await user.save();
        
        return res.status(200).json(successResponse({ message: "Username updated successfully." }));

    } catch (error) {
        console.error("Error updating username:", error);
        return res.status(500).json(errorResponse("updateUsername", ERROR_MESSAGES.updatingUsername));
    };
};

const updateEmail = async ( req, res ) => {
    const { id: userId } = req.user;
    const { email } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json(errorResponse("UpdateEmail", ERROR_MESSAGES.userNotFound));
        };

        const conflictingUser = await User.findOne({
            where: {
                email
            }
        });

        if (conflictingUser) {
            return res.status(400).json(errorResponse("UpdateEmail", ERROR_MESSAGES.emailInUse))
        };

        const emailValidation = validateEmail(email);
        if (email.error) {
            return res.status(500).json(errorResponse("UpdateEmail", emailValidation.message));
        };

        user.email = email;
        await user.save();
        
        return res.status(200).json(successResponse({ message: "Email updated successfully." }));

    } catch (error) {
        console.error("Error updating email:", error);
        return res.status(500).json(errorResponse("UpdateEmail", ERROR_MESSAGES.updatingEmail));

    };
};

const updatePassword = async ( req, res ) => {
    const { id: userId } = req.user;
    const {
        oldPassword,
        newPassword,
        confirmedNewPassword
    } = req.body;

    if (!oldPassword || !newPassword || !confirmedNewPassword) {
        return res.status(400).json(errorResponse("UpdatePassword", ERROR_MESSAGES.missingFields));
    }

    if (newPassword !== confirmedNewPassword) {
        return res.status(400).json(errorResponse("UpdatePassword", ERROR_MESSAGES.passwordMismatch));
    };

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json(errorResponse("UpdatePassword", ERROR_MESSAGES.userNotFound));
        };

        const passwordMatch = await bcrypt.compare(oldPassword, user.hash);
        if (!passwordMatch) {
            return res.status(400).json(errorResponse("UpdatePassword", ERROR_MESSAGES.incorrectPassword));
        };

        const passwordValidation = validatePassword(password);
        if (passwordValidation.error) {
            return res.status(400).json("UpdatePassword", passwordValidation.message);
        };

        const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 4;
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        user.hash = hashedPassword;
        await user.save();

        return res.status(200).json(successResponse({ message: "Password Updated Successfully." }));

    } catch (error) {
        console.error(`Error updating password for User#${userId}:`, error);
        return res.status(500).json(errorResponse("UpdatePassword", ERROR_MESSAGES.updatingPassword));
    };
};

const fetchUser = async (req, res) => {
    res.send(req.user);
};

module.exports = {
    deleteUser,
    updateName,
    updateEmail,
    updateUsername,
    updatePassword,
    fetchUser,
}