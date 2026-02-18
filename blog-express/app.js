const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"]
      }
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

// Routes
app.use('/publications', require('./routes/publications'));
app.use('/create', require('./routes/create'));
app.use('/authentication', require('./routes/authentication'));
app.use('/carousel', require('./routes/carousel'));

// Start server on localhost **ONLY**
app.listen(PORT, 'localhost', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
