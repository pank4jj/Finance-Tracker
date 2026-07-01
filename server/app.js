const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/profile', require('./routes/profile'));

app.get('/', (req, res) => {
  res.send('Finance Tracker API is running. Use /api/health for status.');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

module.exports = app;
