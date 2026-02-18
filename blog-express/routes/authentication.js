// routes/authentication.js
require('dotenv').config();
const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const pool = require('../db');

const loginLimiter = require('../middlewares/loginLimiter');

const { body, validationResult } = require('express-validator');

// Helper function to generate access tokens
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

// Helper function to generate refresh tokens
function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return { refreshToken, expiresAt };
}


cron.schedule('0 0 * * *', async () => {
  try {
    const result = await pool.query(
      'UPDATE refresh_tokens SET revoked = true WHERE expires_at < NOW() AND revoked = false'
    );
    if (result.rowCount > 0) {
      console.log(`Revoked ${result.rowCount} expired tokens.`);
    }
  } catch (error) {
    console.error('Error revoking tokens:', error);
  }
});

// LOGIN ROUTE
Router.post('/login',
    loginLimiter,
    body('username').trim().escape().notEmpty().withMessage('Username is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    async (req, res) => {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

  try {
    const { username, password } = req.body;

    // Query to find the user (unique)
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Invalid username or password' });
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Authorization: Generate JWT tokens
    const myUser = { id: user.id, name: user.username, role:user.role }; // Include user ID in the payload

    const accessToken = generateAccessToken(myUser);
    const { refreshToken, expiresAt } = generateRefreshToken(myUser);

    // Store refresh token in the database
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, expiresAt]
    );

    // Set the refresh token as an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send the access token in the response
    res.json({ accessToken: accessToken });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// REFRESH TOKEN ROUTE
Router.post('/refresh-token', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    // Check if the refresh token exists and is not revoked
    const tokenResult = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND revoked = false',
      [refreshToken]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(403).json({ message: 'Invalid or revoked refresh token' });
    }

    const tokenData = tokenResult.rows[0];

    // Convert expires_at to UTC and compare
    const tokenExpiresAtUTC = new Date(tokenData.expires_at).getTime();
    const currentUTC = Date.now();

    if (currentUTC > tokenExpiresAtUTC) {
      await pool.query('UPDATE refresh_tokens SET revoked = true WHERE token = $1', [refreshToken]);
      return res.status(403).json({ message: 'Refresh token has expired' });
    }
    
    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      // Generate new access token
      const newAccessToken = generateAccessToken({ id: user.id, name: user.name ,role: user.role});

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('Error during token refresh:', error);
    res.status(500).json({ message: 'Server error during token refresh' });
  }
});


// LOGOUT ROUTE
Router.post('/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      // Instead of returning an error, respond with success
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });
      return res.sendStatus(204); // No Content
    }

    // Revoke the refresh token in the database
    await pool.query('UPDATE refresh_tokens SET revoked = true WHERE token = $1', [refreshToken]);

    // Clear the cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Server error during logout' });
  }
});

module.exports = Router;