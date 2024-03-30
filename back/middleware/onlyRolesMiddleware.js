const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
// Middleware function to authenticate and authorize requests
const onlyRolesMiddleware = (allowedRoles) => {
    return async(req, res, next) => {
    // Extract the JWT token from the request headers
    const jwtvalue = req.cookies && req.cookies.jwt;

    if (!jwtvalue) {
        // If token is not provided, send an unauthorized response
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    // Verify the JWT token
    jwt.verify(jwtvalue, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            // If token is invalid or expired, send an unauthorized response
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        } else {
            // Extract the role from the decoded token
            const role = decoded.role
            // Check if the role is one of the allowed values
            if (allowedRoles.includes(role)) {
                // Add role and username to the request object
                next(); // Authorized, proceed to the next middleware or route handler
            } else {
                // If role is invalid, send an unauthorized response
                return res.status(401).json({ message: 'Forbidden: Privilge is not provide for this user' });
            }
        }
    });
}}
;

module.exports = onlyRolesMiddleware;