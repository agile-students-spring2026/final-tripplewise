const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const { expect } = chai;

chai.use(chaiHttp);

describe("Study Sync Server API", () => {
  
  describe("Basic Connectivity", () => {
    it("GET /", (done) => {
      chai.request(server)
        .get("/")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal("Study Sync backend is running");
          done();
        });
    });

    it("GET /api/health", (done) => {
      chai.request(server)
        .get("/api/health")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          done();
        });
    });
  });

  describe("User Profile Management", () => {
    
    it("GET /api/users/me", (done) => {
      chai.request(server)
        .get("/api/users/me")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it("PATCH /api/users/me", (done) => {
      const updateData = { 
        firstName: "Alex", 
        major: "Computer Science" 
      };
      chai.request(server)
        .patch("/api/users/me")
        .send(updateData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.user.firstName).to.equal("Alex");
          expect(res.body.user.major).to.equal("Computer Science");
          done();
        });
    });

    it("PUT /api/users/me/schedule - Failure", (done) => {
      chai.request(server)
        .put("/api/users/me/schedule")
        .send({ schedule: "not an array" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.equal("Expected an array of schedule items");
          done();
        });
    });

    it("PUT /api/users/me/schedule - Success", (done) => {
      const scheduleData = [{ name: "Math", time: "10:00" }];
      chai.request(server)
        .put("/api/users/me/schedule")
        .send(scheduleData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.schedule).to.be.an("array");
          expect(res.body.schedule[0].name).to.equal("Math");
          done();
        });
    });

    it("PUT /api/users/me/locations", (done) => {
      const locData = { locations: ["Main Library"] };
      chai.request(server)
        .put("/api/users/me/locations")
        .send(locData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.preferredLocations).to.deep.equal(["Main Library"]);
          done();
        });
    });

    it("PUT /api/users/me/methods", (done) => {
      const methodData = { methods: ["Pomodoro"] };
      chai.request(server)
        .put("/api/users/me/methods")
        .send(methodData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.preferredMethods).to.deep.equal(["Pomodoro"]);
          done();
        });
    });
  });
});