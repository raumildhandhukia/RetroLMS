// middleware.test.js

const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

describe('extractUserInfoMiddleware', () => {
    test('should extract username and role from JWT token and attach to request object', () => {
        const req = {
            headers: {
                authorization: 'Bearer '
            }
        };
        const res = {};
        const next = jest.fn(); // Mock the next middleware function

        // Mock jwt.verify function
        jwt.verify = jest.fn().mockImplementation((token, secretKey, callback) => {
            callback(null, { username: 'testuser', role: 'admin' });
        });

        // Call the middleware function
        authMiddleware(req, res, next);

        // Assert that req.userInfo is correctly attached
        expect(req.userInfo).toEqual({ username: 'testuser', role: 'admin' });

        // Assert that next middleware function is called
        expect(next).toHaveBeenCalled();
    });

    // Add more test cases as needed
});
