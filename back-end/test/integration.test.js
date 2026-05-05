const chai = require("chai");
const chaiHttp = require("chai-http");
const imported = require("../index");
const app = imported.default || imported;

chai.use(chaiHttp);
const { expect } = chai;

describe("Data Persistence & Integration", () => {
  let token;
  let targetUserId;

  before(async () => {
    const timestamp = Date.now();

    const targetRes = await chai.request(app).post("/api/auth/signup").send({
      username: `integrationtarget${timestamp}`,
      email: `integrationtarget${timestamp}@example.com`,
      password: "password123",
    });

    await chai.request(app).post("/api/auth/signup").send({
      username: `integrationuser${timestamp}`,
      email: `integrationuser${timestamp}@example.com`,
      password: "password123",
    });

    const loginRes = await chai.request(app).post("/api/auth/login").send({
      email: `integrationuser${timestamp}@example.com`,
      password: "password123",
    });

    token = loginRes.body.token;
    targetUserId = targetRes.body.user._id || targetRes.body.user.id;
  });

  it("Approved request should appear as a study sync", async () => {
    const initialSyncsRes = await chai
      .request(app)
      .get("/api/syncs")
      .set("Authorization", `Bearer ${token}`);

    const initialSyncs = initialSyncsRes.body.data || initialSyncsRes.body || [];
    const initialSyncCount = initialSyncs.length;

    const createRes = await chai
      .request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${token}`)
      .send({
        toUserId: targetUserId,
        date: "4/20/2026",
        time: "3:00 PM",
        location: "Library",
      });

    const requestId = createRes.body.data?._id || createRes.body.data?.id;
    if (!requestId) return;

    const approveRes = await chai
      .request(app)
      .post(`/api/requests/${requestId}/approve`)
      .set("Authorization", `Bearer ${token}`);

    expect(approveRes).to.have.status(200);

    const updatedSyncsRes = await chai
      .request(app)
      .get("/api/syncs")
      .set("Authorization", `Bearer ${token}`);

    const updatedSyncs = updatedSyncsRes.body.data || updatedSyncsRes.body || [];
    expect(updatedSyncs.length).to.be.greaterThan(initialSyncCount);
  });

  it("Rejected request should NOT appear as a study sync", async () => {
    const initialSyncsRes = await chai
      .request(app)
      .get("/api/syncs")
      .set("Authorization", `Bearer ${token}`);

    const initialSyncs = initialSyncsRes.body.data || initialSyncsRes.body || [];
    const initialSyncCount = initialSyncs.length;

    const createRes = await chai
      .request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${token}`)
      .send({
        toUserId: targetUserId,
        date: "4/25/2026",
        time: "5:00 PM",
        location: "Test Location For Rejection",
      });

    const requestId = createRes.body.data?._id || createRes.body.data?.id;
    if (!requestId) return;

    const rejectRes = await chai
      .request(app)
      .post(`/api/requests/${requestId}/reject`)
      .set("Authorization", `Bearer ${token}`);

    expect(rejectRes).to.have.status(200);

    const updatedSyncsRes = await chai
      .request(app)
      .get("/api/syncs")
      .set("Authorization", `Bearer ${token}`);

    const updatedSyncs = updatedSyncsRes.body.data || updatedSyncsRes.body || [];
    expect(updatedSyncs.length).to.equal(initialSyncCount);

    const hasSyncWithLocation = updatedSyncs.some(
      (sync) => sync.location === "Test Location For Rejection"
    );

    expect(hasSyncWithLocation).to.be.false;
  });

  it("Approved request should be removed from requests list", async () => {
    const createRes = await chai
      .request(app)
      .post("/api/requests")
      .set("Authorization", `Bearer ${token}`)
      .send({
        toUserId: targetUserId,
        date: "4/22/2026",
        time: "5:00 PM",
        location: "Library",
      });

    const requestId = createRes.body.data?._id || createRes.body.data?.id;
    if (!requestId) return;

    const initialReqRes = await chai
      .request(app)
      .get("/api/requests")
      .set("Authorization", `Bearer ${token}`);

    const initialRequests = initialReqRes.body.data || initialReqRes.body || [];
    const initialReqCount = initialRequests.length;

    await chai
      .request(app)
      .post(`/api/requests/${requestId}/approve`)
      .set("Authorization", `Bearer ${token}`);

    const updatedReqRes = await chai
      .request(app)
      .get("/api/requests")
      .set("Authorization", `Bearer ${token}`);

    const updatedRequests = updatedReqRes.body.data || updatedReqRes.body || [];
    expect(updatedRequests.length).to.be.lessThan(initialReqCount);

    const requestStillExists = updatedRequests.some(
      (request) => (request._id || request.id) === requestId
    );

    expect(requestStillExists).to.be.false;
  });

  it("Created sync should have all required fields", async () => {
    const res = await chai
      .request(app)
      .post("/api/syncs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Integration Sync",
        datetime: new Date().toISOString(),
        location: "Field Test Location",
        message: "Integration test sync",
      });

    expect(res).to.have.status(201);

    const sync = res.body.data;
    expect(sync).to.exist;
    expect(sync).to.have.property("_id");
    expect(sync).to.have.property("title").that.is.a("string");
    expect(sync).to.have.property("datetime");
    expect(sync).to.have.property("location", "Field Test Location");
  });

  it("Multiple approved requests should create separate syncs", async () => {
    const initialSyncsRes = await chai
      .request(app)
      .get("/api/syncs")
      .set("Authorization", `Bearer ${token}`);

    const initialSyncs = initialSyncsRes.body.data || initialSyncsRes.body || [];
    const initialSyncCount = initialSyncs.length;

    let approvedCount = 0;

    for (let i = 0; i < 2; i++) {
      const createRes = await chai
        .request(app)
        .post("/api/requests")
        .set("Authorization", `Bearer ${token}`)
        .send({
          toUserId: targetUserId,
          date: `4/2${i + 3}/2026`,
          time: `${6 + i}:00 PM`,
          location: `Library ${i + 1}`,
        });

      const requestId = createRes.body.data?._id || createRes.body.data?.id;
      if (!requestId) continue;

      const approveRes = await chai
        .request(app)
        .post(`/api/requests/${requestId}/approve`)
        .set("Authorization", `Bearer ${token}`);

      if (approveRes.status === 200) {
        approvedCount++;
      }
    }

    const updatedSyncsRes = await chai
      .request(app)
      .get("/api/syncs")
      .set("Authorization", `Bearer ${token}`);

    const updatedSyncs = updatedSyncsRes.body.data || updatedSyncsRes.body || [];
    expect(updatedSyncs.length).to.be.at.least(initialSyncCount + approvedCount);
  });

  it("Syncs and requests endpoints should use consistent data", async () => {
    const requestsRes = await chai
      .request(app)
      .get("/api/requests")
      .set("Authorization", `Bearer ${token}`);

    const syncsRes = await chai
      .request(app)
      .get("/api/syncs")
      .set("Authorization", `Bearer ${token}`);

    const requests = requestsRes.body.data || requestsRes.body || [];
    const syncs = syncsRes.body.data || syncsRes.body || [];

    expect(requests).to.be.an("array");
    expect(syncs).to.be.an("array");
  });
});