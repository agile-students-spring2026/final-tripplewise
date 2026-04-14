const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const { expect } = chai;

chai.use(chaiHttp);

describe("Study Sync Index API", () => {

  describe("System Endpoints", () => {
    it("GET /health", (done) => {
      chai.request(server)
        .get("/health")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({ ok: true });
          done();
        });
    });
  });

  describe("Profiles API", () => {
    it("GET /api/profiles", (done) => {
      chai.request(server)
        .get("/api/profiles")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body[0]).to.have.property("username");
          done();
        });
    });

    it("GET /api/profile/:id - Success", (done) => {
      chai.request(server)
        .get("/api/profile/1")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.id).to.equal(1);
          done();
        });
    });

    it("GET /api/profile/:id - Not Found", (done) => {
      chai.request(server)
        .get("/api/profile/999")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal("Profile not found");
          done();
        });
    });
  });

  describe("Schedule API", () => {
    it("POST /api/schedule - Success", (done) => {
      const newSchedule = [{ name: "Biology", time: "12:00" }];
      chai.request(server)
        .post("/api/schedule")
        .send(newSchedule)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.schedule).to.be.an("array");
          done();
        });
    });

    it("POST /api/schedule - Failure (Object instead of Array)", (done) => {
      chai.request(server)
        .post("/api/schedule")
        .send({ name: "Biology" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.equal("Expected array");
          done();
        });
    });
  });

  describe("Study Syncs API", () => {
    it("POST /api/syncs - Success", (done) => {
      const syncData = {
        title: "Test Sync",
        datetime: new Date().toISOString(),
        location: "Library",
        message: "Study time"
      };
      chai.request(server)
        .post("/api/syncs")
        .send(syncData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.title).to.equal("Test Sync");
          done();
        });
    });

    it("POST /api/syncs - Missing Fields", (done) => {
      chai.request(server)
        .post("/api/syncs")
        .send({ title: "Incomplete" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.equal("Missing required fields");
          done();
        });
    });
  });

  describe("Matches API", () => {
    it("GET /api/matches - All", (done) => {
      chai.request(server)
        .get("/api/matches")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });

    it("GET /api/matches - Filtered", (done) => {
      chai.request(server)
        .get("/api/matches")
        .query({ location: "Bobst LL2" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.every(m => m.location === "Bobst LL2")).to.be.true;
          done();
        });
    });

    it("GET /api/matches/:id", (done) => {
      chai.request(server)
        .get("/api/matches/101")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.id).to.equal(101);
          done();
        });
    });
  });
});