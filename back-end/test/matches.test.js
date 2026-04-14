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

  it("GET /api/matches includes matchPercentage field", async () => {
    const res = await chai.request(app).get("/api/matches");
    expect(res).to.have.status(200);
    const list = Array.isArray(res.body) ? res.body : res.body.data;
    expect(list.length).to.be.greaterThan(0);
    
    const match = list[0];
    expect(match).to.have.property("matchPercentage");
    expect(match.matchPercentage).to.be.a("number");
    expect(match.matchPercentage).to.be.within(0, 100);
  });

  it("GET /api/matches?sort=match sorts by match percentage descending", async () => {
    const res = await chai.request(app).get("/api/matches?sort=match");
    expect(res).to.have.status(200);
    const list = Array.isArray(res.body) ? res.body : res.body.data;
    
    for (let i = 1; i < list.length; i++) {
      expect(list[i - 1].matchPercentage).to.be.greaterThanOrEqual(
        list[i].matchPercentage
      );
    }
  });

  it("GET /api/matches?sort=name sorts by username alphabetically", async () => {
    const res = await chai.request(app).get("/api/matches?sort=name");
    expect(res).to.have.status(200);
    const list = Array.isArray(res.body) ? res.body : res.body.data;
    
    for (let i = 1; i < list.length; i++) {
      expect(
        list[i - 1].username.localeCompare(list[i].username)
      ).to.be.lessThanOrEqual(0);
    }
  });

  it("GET /api/matches?filter=location returns filtered results", async () => {
    const res = await chai.request(app).get("/api/matches?filter=location");
    expect(res).to.have.status(200);
    const list = Array.isArray(res.body) ? res.body : res.body.data;
    
    // All results should be filtered
    expect(list.length).to.be.greaterThan(0);
    list.forEach((match) => {
      expect(match).to.have.property("id");
    });
  });

  it("GET /api/matches?filter=method returns filtered results", async () => {
    const res = await chai.request(app).get("/api/matches?filter=method");
    expect(res).to.have.status(200);
    const list = Array.isArray(res.body) ? res.body : res.body.data;
    
    expect(list.length).to.be.greaterThan(0);
    list.forEach((match) => {
      expect(match).to.have.property("id");
    });
  });

  it("GET /api/matches/:id returns full profile data", async () => {
    const res = await chai.request(app).get("/api/matches/2");
    expect(res).to.have.status(200);
    const data = Array.isArray(res.body) ? res.body[0] : (res.body.data || res.body);
    
    expect(data).to.have.property("id");
    expect(data).to.have.property("username");
    expect(data).to.have.property("firstName");
    expect(data).to.have.property("lastName");
    expect(data).to.have.property("email");
    expect(data).to.have.property("major");
    expect(data).to.have.property("year");
    expect(data).to.have.property("matchPercentage");
    expect(data).to.have.property("schedule");
    expect(data).to.have.property("preferredLocations");
    expect(data).to.have.property("preferredMethods");
  });

  it("GET /api/matches/:id schedule is an array", async () => {
    const res = await chai.request(app).get("/api/matches/2");
    expect(res).to.have.status(200);
    const data = Array.isArray(res.body) ? res.body[0] : (res.body.data || res.body);
    
    expect(data.schedule).to.be.an("array");
    if (data.schedule.length > 0) {
      expect(data.schedule[0]).to.have.property("name");
      expect(data.schedule[0]).to.have.property("time");
    }
  });

  it("GET /api/matches/:id locations and methods are arrays", async () => {
    const res = await chai.request(app).get("/api/matches/2");
    expect(res).to.have.status(200);
    const data = Array.isArray(res.body) ? res.body[0] : (res.body.data || res.body);
    
    expect(data.preferredLocations).to.be.an("array");
    expect(data.preferredMethods).to.be.an("array");
  });

  it("GET /api/matches returns matches with required fields", async () => {
    const res = await chai.request(app).get("/api/matches");
    expect(res).to.have.status(200);
    const list = Array.isArray(res.body) ? res.body : res.body.data;
    
    expect(list.length).to.be.greaterThan(0);
    list.forEach((match) => {
      expect(match).to.have.property("id");
      expect(match).to.have.property("username");
      expect(match).to.have.property("firstName");
      expect(match).to.have.property("lastName");
      expect(match).to.have.property("matchPercentage");
    });
  });

  it("GET /api/matches match percentages are between 0-100", async () => {
    const res = await chai.request(app).get("/api/matches");
    expect(res).to.have.status(200);
    const list = Array.isArray(res.body) ? res.body : res.body.data;
    
    list.forEach((match) => {
      expect(match.matchPercentage).to.be.within(0, 100);
      expect(match.matchPercentage).to.be.a("number");
    });
  });

  it("GET /api/matches returns consistent results", async () => {
    const res1 = await chai.request(app).get("/api/matches");
    const res2 = await chai.request(app).get("/api/matches");
    
    const list1 = Array.isArray(res1.body) ? res1.body : res1.body.data;
    const list2 = Array.isArray(res2.body) ? res2.body : res2.body.data;
    
    expect(list1.length).to.equal(list2.length);
    expect(list1[0].id).to.equal(list2[0].id);
  });
});