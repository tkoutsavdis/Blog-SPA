const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) 
    return res.status(401).json({ message: 'No authorization header' });

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  if (!token) 
    return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) 
      return res.status(403).json({ message: 'Invalid or expired token' });
    
    // user now contains { id, name, role, iat, exp }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;