process.env.NODE_ENV = "test";
require("dotenv").config();

if (!process.env.TEST_MONGODB_URI) {
  throw new Error("TEST_MONGODB_URI is missing.");
}

process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;

const express = require("express");
const request = require("supertest");
const { expect } = require("chai");
const mongoose = require("mongoose");

const matchesRouter = require("../routes/matches");
const authRouter = require("../routes/auth");

const User = require("../models/User");

async function clearTestDb() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Refusing to clear database outside test environment.");
  }

  if (process.env.MONGODB_URI !== process.env.TEST_MONGODB_URI) {
    throw new Error("Refusing to clear non-test database.");
  }

  await User.deleteMany({});
}

describe("Matches routes", function () {
  this.timeout(10000);

  let app;
  let token;

  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  beforeEach(async function () {
    app = express();
    app.use(express.json());
    app.use("/api/auth", authRouter);
    app.use("/api/matches", matchesRouter);

    await clearTestDb();

    // Create user 1
    const res1 = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "user1",
        email: "user1@test.com",
        password: "password123",
      });

    token = res1.body.token;

    // Create user 2 (potential match)
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "user2",
        email: "user2@test.com",
        password: "password123",
      });
  });

  afterEach(async function () {
    await clearTestDb();
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("should return matches (array)", async function () {
    const res = await request(app)
      .get("/api/matches")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.be.an("array");
  });

  it("should require authentication", async function () {
    const res = await request(app).get("/api/matches");

    expect(res.status).to.equal(401);
  });
});