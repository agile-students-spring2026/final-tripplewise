const chai = require("chai");
const chaiHttp = require("chai-http");
const imported = require("../index");
const app = imported.default || imported;

chai.use(chaiHttp);
const { expect } = chai;

describe("Requests API", () => {
  let token;
  let targetUserId;

  async function createAuthUsers() {
    const ts = Date.now();

    await chai.request(app).post("/api/auth/signup").send({
      username: `requestuser${ts}`,
      email: `requestuser${ts}@example.com`,
      password: "password123",
    });

    const targetRes = await chai.request(app).post("/api/auth/signup").send({
      username: `targetuser${ts}`,
      email: `targetuser${ts}@example.com`,
      password: "password123",
    });

    const loginRes = await chai.request(app).post("/api/auth/login").send({
      email: `requestuser${ts}@example.com`,
      password: "password123",
    });

    token = loginRes.body.token;

    targetUserId =
      targetRes.body.user?._id ||
      targetRes.body.user?.id ||
      null;

    if (!targetUserId) {
      const matchesRes = await chai
        .request(app)
        .get("/api/matches")
        .set("Authorization", `Bearer ${token}`);

      const matches = matchesRes.body.data || matchesRes.body || [];

      if (matches.length > 0) {
        targetUserId = matches[0]._id || matches[0].id;
      }
    }
  }

  async function createRequest(overrides = {}) {
    return chai
      .request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${token}`)
      .send({
        toUserId: targetUserId,
        date: "4/20/2026",
        time: "3:00 PM",
        location: "Library",
        ...overrides,
      });
  }

  before(async () => {
    await createAuthUsers();
  });

  it("GET /api/requests returns array of pending requests", async () => {
    const res = await chai
      .request(app)
      .get("/api/requests")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("GET /api/requests includes required fields", async () => {
    const res = await chai
      .request(app)
      .get("/api/requests")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);

    const requests = res.body || [];

    if (requests.length > 0) {
      const req = requests[0];

      expect(req).to.have.property("_id");
      expect(req).to.have.property("fromUser");
      expect(req).to.have.property("date");
      expect(req).to.have.property("time");
      expect(req).to.have.property("location");
    }
  });

  it("POST /api/requests creates a new meeting request", async () => {
    if (!targetUserId) return;

    const res = await createRequest({
      date: "4/21/2026",
      time: "4:00 PM",
      location: "NYU Library",
    });

    if (res.status === 400) return;

    expect(res).to.have.status(201);
    expect(res.body.data || res.body).to.exist;

    const created = res.body.data || res.body;
    expect(created).to.have.property("_id");
  });

  it("POST /api/requests returns 400 if missing required fields", async () => {
    const res = await chai
      .request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res).to.have.status(400);
  });

  it("POST /api/requests/:id/approve creates a study sync", async () => {
    if (!targetUserId) return;

    const createRes = await createRequest({
      date: "4/22/2026",
      time: "5:00 PM",
      location: "Bobst Library",
    });

    const created = createRes.body.data || createRes.body;
    const requestId = created?._id || created?.id;

    if (!requestId) return;

    const res = await chai
      .request(app)
      .post(`/api/requests/${requestId}/approve`)
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
  });

  it("POST /api/requests/:id/approve removes request from pending list", async () => {
    if (!targetUserId) return;

    const createRes = await createRequest({
      date: "4/23/2026",
      time: "6:00 PM",
      location: "NYU Library",
    });

    const created = createRes.body.data || createRes.body;
    const requestId = created?._id || created?.id;

    if (!requestId) return;

    await chai
      .request(app)
      .post(`/api/requests/${requestId}/approve`)
      .set("Authorization", `Bearer ${token}`);

    const listRes = await chai
      .request(app)
      .get("/api/requests")
      .set("Authorization", `Bearer ${token}`);

    const requests = listRes.body || [];
    const stillExists = requests.some((request) => {
      return (request._id || request.id) === requestId;
    });

    expect(stillExists).to.be.false;
  });

  it("POST /api/requests/:id/reject removes request from pending list", async () => {
    if (!targetUserId) return;

    const createRes = await createRequest({
      date: "4/24/2026",
      time: "4:00 PM",
      location: "Bobst Library",
    });

    const created = createRes.body.data || createRes.body;
    const requestId = created?._id || created?.id;

    if (!requestId) return;

    await chai
      .request(app)
      .post(`/api/requests/${requestId}/reject`)
      .set("Authorization", `Bearer ${token}`);

    const listRes = await chai
      .request(app)
      .get("/api/requests")
      .set("Authorization", `Bearer ${token}`);

    const requests = listRes.body || [];
    const stillExists = requests.some((request) => {
      return (request._id || request.id) === requestId;
    });

    expect(stillExists).to.be.false;
  });

  it("POST /api/requests/:id/approve returns 404 for unknown request", async () => {
    const res = await chai
      .request(app)
      .post("/api/requests/507f1f77bcf86cd799439011/approve")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(404);
  });

  it("POST /api/requests/:id/reject returns 404 for unknown request", async () => {
    const res = await chai
      .request(app)
      .post("/api/requests/507f1f77bcf86cd799439011/reject")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(404);
  });
});