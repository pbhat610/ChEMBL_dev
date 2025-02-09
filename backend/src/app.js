const express = require('express');
const cors = require('cors');
const compoundRoutes = require('./routes/compoundRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', compoundRoutes);

module.exports = app;
