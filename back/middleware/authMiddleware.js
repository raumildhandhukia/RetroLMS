// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware function to authenticate and authorize requests
const authMiddleware = (req, res, next) => {
    // Extract the JWT token from the request headers
    const token = req.headers['authorization'];

    if (!token) {
        // If token is not provided, send an unauthorized response
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            // If token is invalid or expired, send an unauthorized response
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        } else {
            // Extract the role from the decoded token
            const { role } = decoded.role
            const {username} = decoded.username
            // Check if the role is one of the allowed values
            if (['admin', 'instructor', 'student'].includes(role)) {
                // Add the role to the request object
                req.role = role;
                req.username = username;
                next(); // Pass the request to the next middleware or route handler
            } else {
                // If role is invalid, send an unauthorized response
                return res.status(401).json({ message: 'Unauthorized: Invalid role' });
            }
        }
    });
};

module.exports = authMiddleware;
