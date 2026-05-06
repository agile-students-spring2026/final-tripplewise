process.env.NODE_ENV = "test";
require("dotenv").config();

if (!process.env.TEST_MONGODB_URI) {
  throw new Error("TEST_MONGODB_URI is missing. Refusing to run tests.");
}

process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;

const express = require("express");
const request = require("supertest");
const { expect } = require("chai");
const mongoose = require("mongoose");

const authRouter = require("../routes/auth");

const User = require("../models/User");
const StudySync = require("../models/StudySync");
const MeetingRequest = require("../models/MeetingRequest");

async function clearTestDb() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Refusing to wipe database outside test environment.");
  }

  if (process.env.MONGODB_URI !== process.env.TEST_MONGODB_URI) {
    throw new Error("Refusing to wipe non-test database.");
  }

  await User.deleteMany({});
  await StudySync.deleteMany({});
  await MeetingRequest.deleteMany({});
}

describe("Auth routes", function () {
  this.timeout(10000);

  let app;
  let token;

  before(async function () {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  });

  beforeEach(async function () {
    app = express();
    app.use(express.json());
    app.use("/api/auth", authRouter);

    await clearTestDb();
    token = null;
  });

  afterEach(async function () {
    await clearTestDb();
  });

  after(async function () {
    await mongoose.connection.close();
  });

  describe("POST /api/auth/signup", function () {
    it("returns 400 if username is missing", async function () {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          email: "missingusername@example.com",
          password: "password123",
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
    });

    it("returns 400 if email is missing", async function () {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          username: "missingemail",
          password: "password123",
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
    });

    it("returns 400 if password is missing", async function () {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          username: "missingpassword",
          email: "missingpassword@example.com",
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
    });

    it("creates signup successfully with valid data", async function () {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          username: "newuser123",
          email: "newuser@example.com",
          password: "securepass123",
        });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.equal(true);
      expect(res.body.token).to.exist;
      expect(res.body.user.username).to.equal("newuser123");
      expect(res.body.user.email).to.equal("newuser@example.com");

      const userInDB = await User.findOne({ email: "newuser@example.com" });
      expect(userInDB).to.exist;
    });
  });

  describe("POST /api/auth/login", function () {
    beforeEach(async function () {
      const signupRes = await request(app)
        .post("/api/auth/signup")
        .send({
          username: "loginuser123",
          email: "loginuser@example.com",
          password: "password123",
        });

      expect(signupRes.status).to.equal(201);
    });

    it("returns 400 if username is missing", async function () {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          password: "password123",
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
    });

    it("returns 400 if password is missing", async function () {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          username: "loginuser123",
        });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
    });

    it("returns 401 for invalid credentials", async function () {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: "doesnotexist123",
        email: "doesnotexist@example.com",
        password: "wrongpassword",
      });

    expect(res.status).to.equal(401);
    expect(res.body.success).to.equal(false);
  });

    it("logs in successfully with correct credentials", async function () {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          username: "loginuser123",
          email: "loginuser@example.com",
          password: "password123",
        });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.token).to.exist;
      expect(res.body.user.username).to.equal("loginuser123");
      expect(res.body.user.email).to.equal("loginuser@example.com");
    });
  });

  describe("GET /api/auth/me", function () {
    beforeEach(async function () {
      const signupRes = await request(app)
        .post("/api/auth/signup")
        .send({
          username: "meuser123",
          email: "meuser@example.com",
          password: "password123",
        });

      expect(signupRes.status).to.equal(201);
      token = signupRes.body.token;
    });

    it("returns 401 without a token", async function () {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).to.equal(401);
    });

    it("returns current user with a valid token", async function () {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.user.email).to.equal("meuser@example.com");
      expect(res.body.user.password).to.not.exist;
    });
  });
});