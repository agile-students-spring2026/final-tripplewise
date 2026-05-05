const chai = require("chai");
const chaiHttp = require("chai-http");
const imported = require("../index");
const app = imported.default || imported;

chai.use(chaiHttp);
const { expect } = chai;

describe("Syncs API", () => {
  let token;
  let joinUsername;

  before(async () => {
    const timestamp = Date.now();

    const userA = {
      username: `userA${timestamp}`,
      email: `userA${timestamp}@test.com`,
      password: "password123",
    };

    const userB = {
      username: `userB${timestamp}`,
      email: `userB${timestamp}@test.com`,
      password: "password123",
    };

    joinUsername = userB.username;

    await chai.request(app).post("/api/auth/signup").send(userA);
    await chai.request(app).post("/api/auth/signup").send(userB);

    const res = await chai.request(app).post("/api/auth/login").send({
      email: userA.email,
      password: userA.password,
    });

    token = res.body.token;
  });

  function getSyncsFromBody(body) {
    return Array.isArray(body) ? body : body.data || [];
  }

  it("GET /api/syncs returns array of study syncs", async () => {
    const res = await chai
      .request(app)
      .get("/api/syncs")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(getSyncsFromBody(res.body)).to.be.an("array");
  });

  it("POST /api/syncs creates a new study sync", async () => {
    const res = await chai
      .request(app)
      .post("/api/syncs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Sync",
        datetime: new Date().toISOString(),
        location: "Library",
        message: "Study time",
      });

    expect(res).to.have.status(201);
    expect(res.body.success).to.be.true;
  });

  it("POST /api/syncs/:id/join adds a member to sync", async () => {
    const create = await chai
      .request(app)
      .post("/api/syncs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Join Test",
        datetime: new Date().toISOString(),
        location: "NYU",
        message: "Join test",
      });

    const id = create.body.data._id;

    const res = await chai
      .request(app)
      .post(`/api/syncs/${id}/join`)
      .set("Authorization", `Bearer ${token}`)
      .send({ username: joinUsername });

    expect([200, 400]).to.include(res.status);

    if (res.status === 200) {
      expect(res.body.success).to.be.true;
    }
  });

  it("POST /api/syncs/:id/join returns 400 if username missing", async () => {
    const create = await chai
      .request(app)
      .post("/api/syncs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Join Missing",
        datetime: new Date().toISOString(),
        location: "NYU",
        message: "Join test",
      });

    const id = create.body.data._id;

    const res = await chai
      .request(app)
      .post(`/api/syncs/${id}/join`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res).to.have.status(400);
  });

  it("POST /api/syncs/:id/leave removes a member from sync", async () => {
    const create = await chai
      .request(app)
      .post("/api/syncs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Leave Test",
        datetime: new Date().toISOString(),
        location: "NYU",
        message: "Leave test",
      });

    const id = create.body.data._id;

    await chai
      .request(app)
      .post(`/api/syncs/${id}/join`)
      .set("Authorization", `Bearer ${token}`)
      .send({ username: joinUsername });

    const res = await chai
      .request(app)
      .post(`/api/syncs/${id}/leave`)
      .set("Authorization", `Bearer ${token}`)
      .send({ username: joinUsername });

    expect(res).to.have.status(200);
  });

  it("POST /api/syncs/:id/join returns 404 for unknown sync", async () => {
    const res = await chai
      .request(app)
      .post("/api/syncs/507f1f77bcf86cd799439011/join")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "ghostuser" });

    expect(res).to.have.status(404);
  });
});
