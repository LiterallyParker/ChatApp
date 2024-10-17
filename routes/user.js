const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { formatErrorResponse, ERROR_MESSAGES } = require('../util');

// Route to get all users
router.get('/:chunkIndex/:chunkSize', async (req, res) => {
    const chunkIndex = parseInt(req.params.chunkIndex) || 0;
    const chunkSize = parseInt(req.params.chunkSize) || 10;

    try {
        const result = await userController.getUsersByPagination(chunkIndex, chunkSize);

        if (result.error) {
            return res.status(500).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json(formatErrorResponse("FetchingUsers", ERROR_MESSAGES.fetchingUsers))
    }
});

router.post('/register', async (req, res) => {
    try {
        const result = await userController.addUser(req.body);
        if (result.error) {
            return res.status(500).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json(formatErrorResponse("RegisterUser", ERROR_MESSAGES.registration));
    };
});

router.post('/login', async (req, res) => {
    const { identifier, password } = req.body

    if (!identifier || !password) {
        return res.status(400).json(formatErrorResponse("LoginUser", "Please supply username and password."))
    }
    try {
        const result = await userController.getUser(identifier, password);

        if (result.error) {
            return res.status(401).json(result);
        }
        
        return res.status(200).json(result);

    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json(formatErrorResponse("LoginUser", ERROR_MESSAGES.login));
    };
});

module.exports = router;
