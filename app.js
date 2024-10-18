require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const { addUserToReq } = require('./auth');
app.use(addUserToReq)

const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Error starting server:", error);
})