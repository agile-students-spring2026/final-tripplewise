const express = require("express");
const request = require("supertest");
const { expect } = require("chai");

const authRouter = require("../routes/auth");
const { getCurrentUser, setCurrentUser } = require("../data/mockData");

// reset mock user data before each test so that they don't affect each other
function resetMockUser() {
  setCurrentUser({
    id: 1,
    username: "student123",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@nyu.edu",
    phone: "(123) 456-7890",
    major: "Computer Science",
    year: "Junior",
    bio: "Student looking for study partners for CS courses.",
    schedule: [
      { id: 1, name: "Operating Systems", time: "Monday 2:00 PM" },
      { id: 2, name: "Basic Algorithms", time: "Wednesday 4:00 PM" }
    ],
    preferredLocations: [
      "Bobst Library",
      "Kimmel Commuter Lounge"
    ],
    preferredMethods: [
      "Group Study",
      "Practice Problems"
    ]
  });
}

describe("Auth routes", function () {
  let app;

  beforeEach(function () {
    resetMockUser();

    app = express();
    app.use(express.json());
    app.use("/api/auth", authRouter);
  });

  describe("POST /api/auth/signup", function () {
    it("returns 400 if username is missing", async function () {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ password: "newpass123" });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal("Username and password are required");
    });

    it("returns 400 if password is missing", async function () {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ username: "newuser" });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal("Username and password are required");
    });

    it("create signup successfully with valid username and password", async function () {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          username: "syeduser",
          password: "securepass123"
        });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.equal("Signup successful");
      expect(res.body.user.username).to.equal("syeduser");

      const updatedUser = getCurrentUser();
      expect(updatedUser.username).to.equal("syeduser");
      expect(updatedUser.password).to.equal("securepass123");
    });
  });

  describe("POST /api/auth/login", function () {
    it("returns 400 if username is missing", async function () {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ password: "password123" });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal("Username and password are required");
    });

    it("returns 401 for invalid credentials", async function () {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          username: "wronguser",
          password: "wrongpass"
        });

      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal("Invalid username or password");
    });

    it("logins successfully with correct credentials", async function () {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          username: "student123",
          password: "password123"
        });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.equal("Login successful");
      expect(res.body.user.username).to.equal("student123");
      expect(res.body.user.firstName).to.equal("John");
      expect(res.body.user.email).to.equal("johndoe@nyu.edu");
    });
  });
});