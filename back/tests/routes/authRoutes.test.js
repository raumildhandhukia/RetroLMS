const jwt = require('jsonwebtoken');
const {logout} = require('../../routes/authRoutes') 
const request = require('supertest');
const app = require('../../index'); 

describe('Auth Router Testing', () => {
    test('POST /signup route', () => {
      // Test logic for signup route goes here
    });

    test('POST /login route', () => {
        // Test logic for login route goes here
    });

    test('GET /logout route', async () => {

    const response = await request(app).get('/logout');

      // Assert that the response has a 302 status code (redirect)
    expect(response.status).toBe(302);

    // Assert that the response redirected to /login
    expect(response.headers.location).toBe('/login');
  });
})