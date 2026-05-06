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

const requestsRouter = require("../routes/requests");
const authRouter = require("../routes/auth");

const User = require("../models/User");
const RequestModel = require("../models/MeetingRequest");

async function clearTestDb() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Refusing to clear database outside test environment.");
  }

  if (process.env.MONGODB_URI !== process.env.TEST_MONGODB_URI) {
    throw new Error("Refusing to clear non-test database.");
  }

  await User.deleteMany({});
  await RequestModel.deleteMany({});
}

async function createTestRequest(app, token) {
  const res = await request(app)
    .post("/api/requests")
    .set("Authorization", `Bearer ${token}`)
    .send({
      toUsername: "receiver",
      date: "2026-05-10",
      time: "15:00",
      location: "Library",
      message: "Study together",
    });

  expect(res.status).to.equal(201);

  const createdRequest = await RequestModel.findOne({
    fromUser: "sender",
    toUser: "receiver",
  });

  expect(createdRequest).to.not.equal(null);

  return createdRequest;
}

describe("Requests routes", function () {
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
    app.use("/api/requests", requestsRouter);

    await clearTestDb();

    const userRes = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "sender",
        email: "sender@test.com",
        password: "password123",
      });

    token = userRes.body.token;

    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "receiver",
        email: "receiver@test.com",
        password: "password123",
      });
  });

  afterEach(async function () {
    await clearTestDb();
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("should create a meeting request", async function () {
    const createdRequest = await createTestRequest(app, token);

    expect(createdRequest).to.have.property("_id");
    expect(createdRequest.fromUser).to.equal("sender");
    expect(createdRequest.toUser).to.equal("receiver");
  });

  it("should reject a request", async function () {
    const createdRequest = await createTestRequest(app, token);

    const res = await request(app)
      .post(`/api/requests/${createdRequest._id}/reject`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
  });

  it("should approve a request", async function () {
    const createdRequest = await createTestRequest(app, token);

    const res = await request(app)
      .post(`/api/requests/${createdRequest._id}/approve`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
  });

  it("should return 404 for invalid request id", async function () {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/requests/${fakeId}/approve`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(404);
  });
});