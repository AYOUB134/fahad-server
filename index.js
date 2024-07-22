const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const expenseRoutes = require('./routes/expenses');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// Define Routes
app.use('/api/customers', customerRoutes);
app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
