const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

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
        return res.status(500).json({ error: true, message: 'An Error occurred while fetching users.'})
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
        return res.status(500).json({ error: true, message: 'An Error occurred while registering this user.'})
    }
})

module.exports = router;
