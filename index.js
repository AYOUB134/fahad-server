const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const expenseRoutes = require('./routes/expenses');
require('dotenv').config();
const app = express();
// Connect to Database
connectDB();
// Init Middleware
app.use(express.json());
// Enable CORS
app.use(cors());
// Define Routes
app.use('/api/customers', customerRoutes);
app.use('/api/expenses', expenseRoutes);
// Handle 404 - Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});
// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(500).json({ message: 'Internal Server Error' }); // Respond with a generic error message
});
// Set port and start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
