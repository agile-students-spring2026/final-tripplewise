const chai = require("chai");
const chaiHttp = require("chai-http");
const imported = require("../index");
const app = imported.default || imported;

chai.use(chaiHttp);
const { expect } = chai;

describe("Study Sync Server API", () => {
  describe("Basic Connectivity", () => {
    it("GET /health", async () => {
      const res = await chai.request(app).get("/health");

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({ ok: true });
    });
  });
});