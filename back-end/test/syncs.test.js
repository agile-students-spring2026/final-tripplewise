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

const syncsRouter = require("../routes/syncs");
const authRouter = require("../routes/auth");

const User = require("../models/User");
const StudySync = require("../models/StudySync");

async function clearTestDb() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Refusing to clear database outside test environment.");
  }

  if (process.env.MONGODB_URI !== process.env.TEST_MONGODB_URI) {
    throw new Error("Refusing to clear non-test database.");
  }

  await User.deleteMany({});
  await StudySync.deleteMany({});
}

describe("Syncs routes", function () {
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

    await clearTestDb();

    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "syncuser",
        email: "syncuser@test.com",
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

  it("should create a study sync", async function () {
    const res = await request(app)
      .post("/api/syncs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Sync",
        datetime: new Date(),
        location: "Library",
        message: "Study",
        maxMembers: 5,
      });

    expect(res.status).to.equal(201);
  });

  it("should return all syncs", async function () {
    await request(app)
      .post("/api/syncs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Existing Sync",
        datetime: new Date(),
        location: "Room",
        message: "Existing",
        maxMembers: 3,
      });

    const res = await request(app)
      .get("/api/syncs")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should return 404 when deleting a missing sync", async function () {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/syncs/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(404);
  });
});