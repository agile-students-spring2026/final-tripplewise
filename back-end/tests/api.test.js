import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js";

chai.use(chaiHttp);
const { expect } = chai;

describe("Backend API", () => {
  it("GET /health", async () => {
    const res = await chai.request(app).get("/health");
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("ok", true);
  });

  it("GET /api/profiles returns array", async () => {
    const res = await chai.request(app).get("/api/profiles");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("GET /api/profile/:id returns profile", async () => {
    const all = await chai.request(app).get("/api/profiles");
    const id = all.body[0].id;
    const res = await chai.request(app).get(`/api/profile/${id}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("username");
  });

  it("GET /api/syncs returns array", async () => {
    const res = await chai.request(app).get("/api/syncs");
    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("POST /api/syncs creates sync", async () => {
    const payload = { title: "Test", datetime: new Date().toISOString(), location: "Zoom", message: "hi" };
    const res = await chai.request(app).post("/api/syncs").send(payload);
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("title", "Test");
  });

  it("POST /api/schedule saves schedule", async () => {
    const payload = [{ name: "X", time: "10:00" }];
    const res = await chai.request(app).post("/api/schedule").send(payload);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body.schedule).to.be.an("array");
  });
});