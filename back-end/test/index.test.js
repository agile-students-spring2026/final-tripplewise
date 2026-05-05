const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const { expect } = chai;

chai.use(chaiHttp);

describe("Study Sync Index API", () => {
  let token;

  before((done) => {
    const timestamp = Date.now();
    const testEmail = `index-test-${timestamp}@example.com`;
    const matchEmail = `index-match-${timestamp}@example.com`;

    chai.request(server)
      .post("/api/auth/signup")
      .send({
        username: `indextest${timestamp}`,
        email: testEmail,
        password: "password123",
      })
      .end(() => {
        chai.request(server)
          .post("/api/auth/signup")
          .send({
            username: `matchtest${timestamp}`,
            email: matchEmail,
            password: "password123",
          })
          .end(() => {
            chai.request(server)
              .post("/api/auth/login")
              .send({
                email: testEmail,
                password: "password123",
              })
              .end((err, res) => {
                token = res.body.token;
                done();
              });
          });
      });
  });

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
      chai.request(server)
        .post("/api/schedule")
        .send([{ name: "Biology", time: "12:00" }])
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
      chai.request(server)
        .post("/api/syncs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Sync",
          datetime: new Date().toISOString(),
          location: "Library",
          message: "Study time",
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.success).to.be.true;
          expect(res.body.data.title).to.equal("Test Sync");
          done();
        });
    });

    it("POST /api/syncs - Missing Fields", (done) => {
      chai.request(server)
        .post("/api/syncs")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Incomplete" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });

  describe("Matches API", () => {
    it("GET /api/matches - All", (done) => {
      chai.request(server)
        .get("/api/matches")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.be.an("array");
          done();
        });
    });

    it("GET /api/matches - Filtered", (done) => {
      chai.request(server)
        .get("/api/matches")
        .set("Authorization", `Bearer ${token}`)
        .query({ location: "Bobst LL2" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.be.an("array");
          done();
        });
    });

    it("GET /api/matches/:id", (done) => {
      chai.request(server)
        .get("/api/matches")
        .set("Authorization", `Bearer ${token}`)
        .end((err, matchesRes) => {
          expect(matchesRes).to.have.status(200);

          const matches = matchesRes.body.data || [];
          if (!matches.length) return done();

          const id = matches[0]._id || matches[0].id;
          if (!id) return done();

          chai.request(server)
            .get(`/api/matches/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              done();
            });
        });
    });
  });
});