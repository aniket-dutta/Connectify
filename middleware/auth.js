const jwt = require('jsonwebtoken');
const config = require('config');

function middleware(req, res, next) {
  // Get the token from the header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res
      .status(401)
      .json({ msg: 'Authorization Failed, No token found' });
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = middleware;
