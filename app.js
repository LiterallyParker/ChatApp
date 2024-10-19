require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');
const PORT = process.env.PORT || 8080;
const { errorResponse, ERROR_MESSAGES } = require('./util');

app.use(express.json());
app.use(cors());

const { addUserToReq } = require('./auth');
app.use(addUserToReq);

const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

app.use('*', (req, res) => {
    res.status(404).json(errorResponse("API404", ERROR_MESSAGES.unknownRoute));
});

app.use((error, req, res, next) => {
    console.error("Error with the server:", error);
    res.send({ error });
});

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Error starting server:", error);
});