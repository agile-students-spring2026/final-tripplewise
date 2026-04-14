const chai = require("chai");
const chaiHttp = require("chai-http");
// require may return a module namespace when index.js is ESM — normalize below
const imported = require("../index");
const app = imported.default || imported;

chai.use(chaiHttp);
const { expect } = chai;

describe("Matches API", () => {
  it("GET /api/matches returns array", async () => {
    const res = await chai.request(app).get("/api/matches");
    expect(res).to.have.status(200);
    // allow either { success: true, data: [...] } or direct array response
    if (Array.isArray(res.body)) {
      expect(res.body).to.be.an("array");
    } else {
      expect(res.body).to.have.property("data").that.is.an("array");
    }
  });

  it("GET /api/matches/:id returns detail for existing id", async () => {
    const listRes = await chai.request(app).get("/api/matches");
    const list = Array.isArray(listRes.body) ? listRes.body : listRes.body.data;
    const id = list[0].id;
    const res = await chai.request(app).get(`/api/matches/${id}`);
    expect(res).to.have.status(200);
    const payload = Array.isArray(res.body) ? res.body[0] : (res.body.data || res.body);
    expect(payload).to.have.property("username");
    expect(payload).to.have.property("id", id);
  });

  it("GET /api/matches/:id returns 404 for unknown id", async () => {
    const res = await chai.request(app).get("/api/matches/99999999");
    expect(res).to.have.status(404);
  });
});