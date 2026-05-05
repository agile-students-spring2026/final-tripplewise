const chai = require("chai");
const chaiHttp = require("chai-http");
const imported = require("../index");
const app = imported.default || imported;
const { expect } = chai;

chai.use(chaiHttp);

describe("Matches API", () => {
  let token;

  before(async () => {
    const email = `match-${Date.now()}@example.com`;

    await chai.request(app).post("/api/auth/signup").send({
      username: `matchuser${Date.now()}`,
      email,
      password: "password123",
    });

    const res = await chai.request(app).post("/api/auth/login").send({
      email,
      password: "password123",
    });

    token = res.body.token;
  });

  it("GET /api/matches returns array", async () => {
    const res = await chai
      .request(app)
      .get("/api/matches")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an("array");
  });

  it("GET /api/matches/:id returns detail for existing id", async () => {
    const listRes = await chai
      .request(app)
      .get("/api/matches")
      .set("Authorization", `Bearer ${token}`);

    expect(listRes).to.have.status(200);

    const matches = listRes.body.data || [];

    if (!matches.length) return;

    const id = matches[0]._id || matches[0].id;

    if (!id) return;

    const res = await chai
      .request(app)
      .get(`/api/matches/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.exist;
  });

  it("GET /api/matches/:id returns 404 for unknown id", async () => {
    const res = await chai
      .request(app)
      .get("/api/matches/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(404);
  });

  it("GET /api/matches includes matchPercentage field", async () => {
    const res = await chai
      .request(app)
      .get("/api/matches")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);

    const matches = res.body.data || [];

    if (!matches.length) return;

    expect(matches[0]).to.have.property("matchPercentage");
  });

  it("GET /api/matches match percentages are between 0-100", async () => {
    const res = await chai
      .request(app)
      .get("/api/matches")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);

    const matches = res.body.data || [];

    matches.forEach((match) => {
      expect(match.matchPercentage).to.be.at.least(0);
      expect(match.matchPercentage).to.be.at.most(100);
    });
  });
});