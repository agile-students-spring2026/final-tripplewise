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

const authRouter = require("../routes/auth");
const syncsRouter = require("../routes/syncs");
const requestsRouter = require("../routes/requests");

const User = require("../models/User");
const StudySync = require("../models/StudySync");
const RequestModel = require("../models/MeetingRequest");

async function clearTestDb() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Refusing to clear database outside test environment.");
  }

  if (process.env.MONGODB_URI !== process.env.TEST_MONGODB_URI) {
    throw new Error("Refusing to clear non-test database.");
  }

  await User.deleteMany({});
  await StudySync.deleteMany({});
  await RequestModel.deleteMany({});
}

describe("Integration tests", function () {
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
    app.use("/api/syncs", syncsRouter);
    app.use("/api/requests", requestsRouter);

    await clearTestDb();

    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "integrationUser",
        email: "integration@test.com",
        password: "password123",
      });

    token = res.body.token;
  });

  afterEach(async function () {
    await clearTestDb();
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("should signup, create sync, and create request", async function () {
    // create another user
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "otherUser",
        email: "other@test.com",
        password: "password123",
      });

    // create sync
    const syncRes = await request(app)
      .post("/api/syncs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Integration Sync",
        datetime: new Date(),
        location: "Library",
        message: "Study",
        maxMembers: 5,
      });

    expect(syncRes.status).to.equal(201);

    // create request
    const requestRes = await request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${token}`)
      .send({
        toUsername: "otherUser",
        date: "2026-05-10",
        time: "15:00",
        location: "Library",
        message: "Join session",
      });

    expect(requestRes.status).to.equal(201);

    // verify request exists in DB
    const dbRequest = await RequestModel.findOne({
      fromUser: "integrationUser",
      toUser: "otherUser",
    });

    expect(dbRequest).to.not.equal(null);
  });
});