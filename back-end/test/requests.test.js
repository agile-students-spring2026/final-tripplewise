const chai = require("chai");
const chaiHttp = require("chai-http");
const imported = require("../index");
const app = imported.default || imported;

chai.use(chaiHttp);
const { expect } = chai;

describe("Requests API", () => {
  it("GET /api/requests returns array of pending requests", async () => {
    const res = await chai.request(app).get("/api/requests");
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body).to.have.property("data").that.is.an("array");
  });

  it("GET /api/requests includes required fields", async () => {
    const res = await chai.request(app).get("/api/requests");
    expect(res).to.have.status(200);
    const requests = res.body.data;
    if (requests.length > 0) {
      const req = requests[0];
      expect(req).to.have.property("_id");
      expect(req).to.have.property("fromUser");
      expect(req).to.have.property("date");
      expect(req).to.have.property("time");
      expect(req).to.have.property("location");
      expect(req).to.have.property("status", "pending");
    }
  });

  it("POST /api/requests creates a new meeting request", async () => {
    const newRequest = {
      toUserId: "user123",
      date: "4/20/2026",
      time: "3:00 PM",
      location: "NYU Library"
    };
    
    const res = await chai.request(app).post("/api/requests").send(newRequest);
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("success", true);
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.have.property("_id");
    expect(res.body.data).to.have.property("date", "4/20/2026");
    expect(res.body.data).to.have.property("status", "pending");
  });

  it("POST /api/requests returns 400 if missing required fields", async () => {
    const incompleteRequest = {
      toUserId: "user123",
      date: "4/20/2026"
      // missing time and location
    };
    
    const res = await chai.request(app).post("/api/requests").send(incompleteRequest);
    expect(res).to.have.status(400);
    expect(res.body).to.have.property("error");
  });

  it("POST /api/requests/:id/approve creates a study sync", async () => {
    // Get initial requests
    const listRes = await chai.request(app).get("/api/requests");
    const requests = listRes.body.data;
    
    if (requests.length > 0) {
      const requestId = requests[0].id;
      
      // Approve the request
      const res = await chai.request(app).post(`/api/requests/${requestId}/approve`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("data");
      expect(res.body.data).to.have.property("title");
      expect(res.body.data).to.have.property("status", "active");
    }
  });

  it("POST /api/requests/:id/approve removes request from pending list", async () => {
    // Get initial requests
    const listRes1 = await chai.request(app).get("/api/requests");
    const initialCount = listRes1.body.data.length;
    
    if (initialCount > 0) {
      const requestId = listRes1.body.data[0].id;
      
      // Approve the request
      await chai.request(app).post(`/api/requests/${requestId}/approve`);
      
      // Check that request count decreased
      const listRes2 = await chai.request(app).get("/api/requests");
      expect(listRes2.body.data.length).to.be.lessThan(initialCount);
    }
  });

  it("POST /api/requests/:id/reject removes request from pending list", async () => {
    // Create a new request first
    const newRequest = {
      toUserId: "user456",
      date: "4/21/2026",
      time: "4:00 PM",
      location: "Bobst Library"
    };
    
    const createRes = await chai.request(app).post("/api/requests").send(newRequest);
    const requestId = createRes.body.data.id;
    
    // Get count before rejection
    const listRes1 = await chai.request(app).get("/api/requests");
    const countBefore = listRes1.body.data.length;
    
    // Reject the request
    const rejectRes = await chai.request(app).post(`/api/requests/${requestId}/reject`);
    expect(rejectRes).to.have.status(200);
    expect(rejectRes.body).to.have.property("success", true);
    
    // Verify count decreased
    const listRes2 = await chai.request(app).get("/api/requests");
    expect(listRes2.body.data.length).to.be.lessThan(countBefore);
  });

  it("POST /api/requests/:id/approve returns 404 for unknown request", async () => {
    const res = await chai.request(app).post("/api/requests/99999999/approve");
    expect(res).to.have.status(404);
    expect(res.body).to.have.property("error");
  });

  it("POST /api/requests/:id/reject returns 404 for unknown request", async () => {
    const res = await chai.request(app).post("/api/requests/99999999/reject");
    expect(res).to.have.status(404);
    expect(res.body).to.have.property("error");
  });
});
