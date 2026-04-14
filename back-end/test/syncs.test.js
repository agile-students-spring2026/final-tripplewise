const chai = require("chai");
const chaiHttp = require("chai-http");
const imported = require("../index");
const app = imported.default || imported;

chai.use(chaiHttp);
const { expect } = chai;

describe("Syncs API", () => {
  it("GET /api/syncs returns array of study syncs", async () => {
    const res = await chai.request(app).get("/api/syncs");
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body).to.have.property("data").that.is.an("array");
  });

  it("GET /api/syncs includes required fields", async () => {
    const res = await chai.request(app).get("/api/syncs");
    expect(res).to.have.status(200);
    const syncs = res.body.data;
    if (syncs.length > 0) {
      const sync = syncs[0];
      expect(sync).to.have.property("id");
      expect(sync).to.have.property("title");
      expect(sync).to.have.property("datetime");
      expect(sync).to.have.property("location");
      expect(sync).to.have.property("members").that.is.an("array");
      expect(sync).to.have.property("status");
    }
  });

  it("POST /api/syncs creates a new study sync", async () => {
    const newSync = {
      title: "Test Study Group",
      datetime: "2026-04-20T15:00:00Z",
      location: "Test Location",
      message: "Test message",
      members: ["user1", "user2"],
      maxMembers: 5
    };
    
    const res = await chai.request(app).post("/api/syncs").send(newSync);
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("success", true);
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.have.property("id");
    expect(res.body.data).to.have.property("title", "Test Study Group");
    expect(res.body.data).to.have.property("status", "active");
  });

  it("POST /api/syncs returns 400 if missing required fields", async () => {
    const incompleteSync = {
      title: "Test Study Group",
      datetime: "2026-04-20T15:00:00Z"
      // missing location
    };
    
    const res = await chai.request(app).post("/api/syncs").send(incompleteSync);
    expect(res).to.have.status(400);
    expect(res.body).to.have.property("error");
  });

  it("POST /api/syncs/:id/join adds a member to sync", async () => {
    // Get existing syncs
    const listRes = await chai.request(app).get("/api/syncs");
    const syncs = listRes.body.data;
    
    if (syncs.length > 0) {
      const syncId = syncs[0].id;
      const initialMemberCount = syncs[0].members.length;
      
      // Join the sync
      const res = await chai.request(app).post(`/api/syncs/${syncId}/join`).send({
        username: "test_user_join"
      });
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.data.members.length).to.be.greaterThan(initialMemberCount);
    }
  });

  it("POST /api/syncs/:id/join returns 400 if username missing", async () => {
    const listRes = await chai.request(app).get("/api/syncs");
    const syncs = listRes.body.data;
    
    if (syncs.length > 0) {
      const syncId = syncs[0].id;
      const res = await chai.request(app).post(`/api/syncs/${syncId}/join`).send({});
      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    }
  });

  it("POST /api/syncs/:id/join returns 400 if user already member", async () => {
    const listRes = await chai.request(app).get("/api/syncs");
    const syncs = listRes.body.data;
    
    if (syncs.length > 0 && syncs[0].members.length > 0) {
      const syncId = syncs[0].id;
      const existingMember = syncs[0].members[0];
      
      const res = await chai.request(app).post(`/api/syncs/${syncId}/join`).send({
        username: existingMember
      });
      
      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    }
  });

  it("POST /api/syncs/:id/leave removes a member from sync", async () => {
    // Get existing syncs
    const listRes = await chai.request(app).get("/api/syncs");
    const syncs = listRes.body.data;
    
    if (syncs.length > 0 && syncs[0].members.length > 0) {
      const syncId = syncs[0].id;
      const memberToRemove = syncs[0].members[0];
      const initialMemberCount = syncs[0].members.length;
      
      // Leave the sync
      const res = await chai.request(app).post(`/api/syncs/${syncId}/leave`).send({
        username: memberToRemove
      });
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.data.members.length).to.be.lessThan(initialMemberCount);
    }
  });

  it("POST /api/syncs/:id/leave returns 400 if user not in sync", async () => {
    const listRes = await chai.request(app).get("/api/syncs");
    const syncs = listRes.body.data;
    
    if (syncs.length > 0) {
      const syncId = syncs[0].id;
      const res = await chai.request(app).post(`/api/syncs/${syncId}/leave`).send({
        username: "nonexistent_user_12345"
      });
      
      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    }
  });

  it("PUT /api/syncs/:id/status updates sync status to completed", async () => {
    const listRes = await chai.request(app).get("/api/syncs");
    const syncs = listRes.body.data;
    
    if (syncs.length > 0) {
      const syncId = syncs[0].id;
      
      const res = await chai.request(app).put(`/api/syncs/${syncId}/status`).send({
        status: "completed"
      });
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.data).to.have.property("status", "completed");
    }
  });

  it("PUT /api/syncs/:id/status updates sync status back to active", async () => {
    const listRes = await chai.request(app).get("/api/syncs");
    const syncs = listRes.body.data;
    
    if (syncs.length > 0) {
      const syncId = syncs[0].id;
      
      const res = await chai.request(app).put(`/api/syncs/${syncId}/status`).send({
        status: "active"
      });
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.data).to.have.property("status", "active");
    }
  });

  it("PUT /api/syncs/:id/status returns 400 for invalid status", async () => {
    const listRes = await chai.request(app).get("/api/syncs");
    const syncs = listRes.body.data;
    
    if (syncs.length > 0) {
      const syncId = syncs[0].id;
      
      const res = await chai.request(app).put(`/api/syncs/${syncId}/status`).send({
        status: "invalid_status"
      });
      
      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    }
  });

  it("POST /api/syncs/:id/join returns 404 for unknown sync", async () => {
    const res = await chai.request(app).post("/api/syncs/99999999/join").send({
      username: "test_user"
    });
    expect(res).to.have.status(404);
    expect(res.body).to.have.property("error");
  });

  it("POST /api/syncs/:id/leave returns 404 for unknown sync", async () => {
    const res = await chai.request(app).post("/api/syncs/99999999/leave").send({
      username: "test_user"
    });
    expect(res).to.have.status(404);
    expect(res.body).to.have.property("error");
  });

  it("PUT /api/syncs/:id/status returns 404 for unknown sync", async () => {
    const res = await chai.request(app).put("/api/syncs/99999999/status").send({
      status: "completed"
    });
    expect(res).to.have.status(404);
    expect(res.body).to.have.property("error");
  });
});
