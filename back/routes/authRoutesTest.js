const request = require("supertest");
const app = require("../index"); // replace with the actual path to your Express app file
const User = require("../models/userModel"); // replace with the actual path to your User model file

describe("Authentication Routes", () => {
  // Assuming you have already seeded a test user for login tests
  const testUser = {
    username: "parvd",
    password: "parvd@123",
  };

  describe("POST /signup", () => {
    it("should create a new user", async () => {
      const response = await request(app)
        .post("/signup")
        .send({
          username: "newuser",
          password: "newpassword",
          role: "user",
          profile: { email: "newuser@example.com" },
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toContain("User created successfully.");

      // Clean up: Delete the test user created during the test
      await User.findOneAndDelete({ username: "newuser" });
    });

    it("should return 400 if user already exists", async () => {
      const response = await request(app)
        .post("/signup")
        .send({
          username: testUser.username,
          password: "newpassword",
          role: "user",
          profile: { email: "newuser@example.com" },
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("User already exists");
    });
  });

  describe("POST /login", () => {
    it("should log in a user with valid credentials", async () => {
      const response = await request(app).post("/login").send({
        username: testUser.username,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app).post("/login").send({
        username: "nonexistentuser",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain("Invalid credentials");
    });
  });
});
