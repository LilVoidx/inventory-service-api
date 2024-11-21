const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const StockRouter = require('./routes/stock.route');
const error = require('./middlewares/error.middleware');
const { HISTORY_SERVICE_URL } = require('./config/env.config');

const app = express();

app.use(morgan('dev'));
app.use(
  cors({
    origin: HISTORY_SERVICE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(helmet());
app.use(express.json());

// index route
app.get('/', (req, res) => {
  res.json({
    message: 'Inventory Stock Management',
  });
});

app.use('/api', StockRouter);

app.use(error.notFound);
app.use(error.errorHandler);

module.exports = app;
