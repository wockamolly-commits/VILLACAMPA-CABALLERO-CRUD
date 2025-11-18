const express = require('express');
const cors = require('cors');
const db = require('./db');
const productsRouter = require('./routes/products');
const { router: authRouter, authenticateToken } = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes (unprotected)
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/products', authenticateToken, productsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
