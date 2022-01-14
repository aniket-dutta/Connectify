const express = require('express');
const { connect } = require('mongoose');
const connectDB = require('./config/db');
const { check, validationResult } = require('express-validator');

const app = express();
const cors = require('cors');

//connect db
connectDB();

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
// Init Middleware
// Parse json
// Allow CORS access
app.use(express.json({ extended: false }));
app.use(cors());
// app.use(cors(corsOptions));

app.get('/', (req, res) => res.send('Api running'));

// Defile Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
