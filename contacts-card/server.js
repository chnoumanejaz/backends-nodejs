const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');
const dotenv = require('dotenv').config();

connectDb();
const app = express();
const SERVER_URL = `http://localhost:${process.env.PORT}`;

app.use(express.json());
app.use('/api/v1/contacts', require('./routes/contactRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log('Your server is running at: ' + SERVER_URL);
});
