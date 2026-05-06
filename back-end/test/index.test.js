process.env.NODE_ENV = "test";
require("dotenv").config();

if (!process.env.TEST_MONGODB_URI) {
  throw new Error("TEST_MONGODB_URI is missing.");
}

process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;

const request = require("supertest");
const { expect } = require("chai");
const mongoose = require("mongoose");

const app = require("../server");

describe("Index / Base routes", function () {
  this.timeout(10000);

  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("should return 404 for unknown route", async function () {
    const res = await request(app).get("/random-route-that-does-not-exist");
    expect(res.status).to.equal(404);
  });

  it("should respond to root route if defined", async function () {
    const res = await request(app).get("/");

    expect([200, 404]).to.include(res.status);
  });
});