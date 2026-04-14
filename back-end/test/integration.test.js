const chai = require("chai");
const chaiHttp = require("chai-http");
const imported = require("../index");
const app = imported.default || imported;

chai.use(chaiHttp);
const { expect } = chai;

describe("Data Persistence & Integration", () => {
  it("Approved request should appear as a study sync", async () => {
    // Get initial sync count
    const initialSyncsRes = await chai.request(app).get("/api/syncs");
    const initialSyncCount = initialSyncsRes.body.data.length;
    
    // Get a pending request
    const requestsRes = await chai.request(app).get("/api/requests");
    const requests = requestsRes.body.data;
    
    if (requests.length > 0) {
      const requestId = requests[0].id;
      const requestDetails = requests[0];
      
      // Approve the request
      const approveRes = await chai.request(app).post(`/api/requests/${requestId}/approve`);
      expect(approveRes).to.have.status(200);
      const createdSync = approveRes.body.data;
      
      // Verify the returned sync contains request data
      expect(createdSync).to.have.property("title").that.includes(requestDetails.fromUser);
      expect(createdSync).to.have.property("location", requestDetails.location);
      expect(createdSync).to.have.property("status", "active");
      
      // Get syncs again and verify sync count increased
      const updatedSyncsRes = await chai.request(app).get("/api/syncs");
      const updatedSyncCount = updatedSyncsRes.body.data.length;
      
      expect(updatedSyncCount).to.be.greaterThan(initialSyncCount);
      
      // Verify the new sync is in the list
      const newSync = updatedSyncsRes.body.data.find(s => s.id === createdSync.id);
      expect(newSync).to.exist;
      expect(newSync).to.have.property("title").that.includes(requestDetails.fromUser);
    }
  });

  it("Rejected request should NOT appear as a study sync", async () => {
    // Create a new request
    const newRequest = {
      toUserId: "reject_test_user",
      date: "4/25/2026",
      time: "5:00 PM",
      location: "Test Location For Rejection"
    };
    
    const createRes = await chai.request(app).post("/api/requests").send(newRequest);
    const requestId = createRes.body.data.id;
    
    // Get initial sync count
    const initialSyncsRes = await chai.request(app).get("/api/syncs");
    const initialSyncCount = initialSyncsRes.body.data.length;
    
    // Reject the request
    const rejectRes = await chai.request(app).post(`/api/requests/${requestId}/reject`);
    expect(rejectRes).to.have.status(200);
    
    // Get syncs and verify count hasn't changed
    const updatedSyncsRes = await chai.request(app).get("/api/syncs");
    const updatedSyncCount = updatedSyncsRes.body.data.length;
    
    expect(updatedSyncCount).to.equal(initialSyncCount);
    
    // Verify no sync contains the rejection location
    const hasSyncWithLocation = updatedSyncsRes.body.data.some(s => 
      s.location === "Test Location For Rejection"
    );
    expect(hasSyncWithLocation).to.be.false;
  });

  it("Approved request should be removed from requests list", async () => {
    // Get initial requests
    const initialReqRes = await chai.request(app).get("/api/requests");
    const initialReqCount = initialReqRes.body.data.length;
    
    if (initialReqCount > 0) {
      const requestId = initialReqRes.body.data[0].id;
      
      // Approve the request
      await chai.request(app).post(`/api/requests/${requestId}/approve`);
      
      // Get updated requests
      const updatedReqRes = await chai.request(app).get("/api/requests");
      const updatedReqCount = updatedReqRes.body.data.length;
      
      // Verify request was removed
      expect(updatedReqCount).to.be.lessThan(initialReqCount);
      
      // Verify the specific request is gone
      const requestStillExists = updatedReqRes.body.data.some(r => r.id === requestId);
      expect(requestStillExists).to.be.false;
    }
  });

  it("Created sync should have all required fields", async () => {
    // Create a new request
    const newRequest = {
      toUserId: "field_test_user",
      date: "4/26/2026",
      time: "6:00 PM",
      location: "Field Test Location"
    };
    
    const createRes = await chai.request(app).post("/api/requests").send(newRequest);
    const requestId = createRes.body.data.id;
    
    // Approve it
    const approveRes = await chai.request(app).post(`/api/requests/${requestId}/approve`);
    const createdSync = approveRes.body.data;
    
    // Verify all required fields exist
    expect(createdSync).to.have.property("id").that.is.a("number");
    expect(createdSync).to.have.property("title").that.is.a("string");
    expect(createdSync).to.have.property("datetime").that.is.a("string");
    expect(createdSync).to.have.property("location", "Field Test Location");
    expect(createdSync).to.have.property("message").that.is.a("string");
    expect(createdSync).to.have.property("members").that.is.an("array");
    expect(createdSync).to.have.property("maxMembers").that.is.a("number");
    expect(createdSync).to.have.property("status", "active");
  });

  it("Multiple approved requests should create separate syncs", async () => {
    // Get initial sync count
    const initialSyncsRes = await chai.request(app).get("/api/syncs");
    const initialSyncCount = initialSyncsRes.body.data.length;
    const initialSyncIds = new Set(initialSyncsRes.body.data.map(s => s.id));
    
    // Get requests
    const requestsRes = await chai.request(app).get("/api/requests");
    const requests = requestsRes.body.data;
    
    let approvedCount = 0;
    
    // Approve first 2 requests (if available)
    for (let i = 0; i < Math.min(2, requests.length); i++) {
      const requestId = requests[i].id;
      const approveRes = await chai.request(app).post(`/api/requests/${requestId}/approve`);
      
      if (approveRes.status === 200) {
        approvedCount++;
      }
    }
    
    if (approvedCount > 0) {
      // Get updated syncs
      const updatedSyncsRes = await chai.request(app).get("/api/syncs");
      const updatedSyncCount = updatedSyncsRes.body.data.length;
      
      // Verify new syncs were created (count increased)
      expect(updatedSyncCount).to.equal(initialSyncCount + approvedCount);
      
      // Verify new syncs have different IDs
      const newSyncIds = updatedSyncsRes.body.data.map(s => s.id);
      const newIds = newSyncIds.filter(id => !initialSyncIds.has(id));
      expect(newIds.length).to.equal(approvedCount);
    }
  });

  it("Syncs and requests endpoints should use consistent data", async () => {
    // Create a new request
    const newRequest = {
      toUserId: "consistency_test",
      date: "4/27/2026",
      time: "7:00 PM",
      location: "Consistency Test Location"
    };
    
    const createRes = await chai.request(app).post("/api/requests").send(newRequest);
    const requestId = createRes.body.data.id;
    
    // Verify request appears in GET /api/requests
    const reqsBeforeApprove = await chai.request(app).get("/api/requests");
    const requestExists = reqsBeforeApprove.body.data.some(r => r.id === requestId);
    expect(requestExists).to.be.true;
    
    // Approve the request
    const approveRes = await chai.request(app).post(`/api/requests/${requestId}/approve`);
    expect(approveRes).to.have.status(200);
    
    // Verify request is gone from /api/requests
    const reqsAfterApprove = await chai.request(app).get("/api/requests");
    const requestGone = !reqsAfterApprove.body.data.some(r => r.id === requestId);
    expect(requestGone).to.be.true;
    
    // Verify sync is in /api/syncs
    const syncs = await chai.request(app).get("/api/syncs");
    const syncExists = syncs.body.data.some(s => s.id === approveRes.body.data.id);
    expect(syncExists).to.be.true;
  });
});
