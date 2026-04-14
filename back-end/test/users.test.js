const express = require("express");
const request = require("supertest");
const { expect } = require("chai");

const { getCurrentUser, setCurrentUser } = require("../data/mockData");

// ─── helpers ────────────────────────────────────────────────────────────────

/** Re-create a fresh Express app with only the /api/users/me routes so that
 *  we don't start a real TCP server and don't depend on other route files. */
function buildApp() {
  const app = express();
  app.use(express.json());

  // GET /api/users/me
  app.get("/api/users/me", (req, res) => {
    const user = getCurrentUser();
    res.json(user);
  });

  // PATCH /api/users/me
  app.patch("/api/users/me", (req, res) => {
    const { username, firstName, lastName, email, phone, major, year, bio } =
      req.body || {};
    const user = getCurrentUser();
    const updated = {
      ...user,
      ...(username  !== undefined && { username  }),
      ...(firstName !== undefined && { firstName }),
      ...(lastName  !== undefined && { lastName  }),
      ...(email     !== undefined && { email     }),
      ...(phone     !== undefined && { phone     }),
      ...(major     !== undefined && { major     }),
      ...(year      !== undefined && { year      }),
      ...(bio       !== undefined && { bio       }),
    };
    setCurrentUser(updated);
    res.json({ success: true, user: updated });
  });

  // PUT /api/users/me/schedule
  app.put("/api/users/me/schedule", (req, res) => {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Expected an array of schedule items" });
    }
    const user = getCurrentUser();
    const schedule = payload.map((c, i) => ({
      id:   c.id   ?? Date.now() + i,
      name: c.name ?? "",
      time: c.time ?? "09:00",
    }));
    setCurrentUser({ ...user, schedule });
    res.json({ success: true, schedule });
  });

  // PUT /api/users/me/locations
  app.put("/api/users/me/locations", (req, res) => {
    const { locations } = req.body || {};
    if (!Array.isArray(locations)) {
      return res.status(400).json({ error: "Expected { locations: [] }" });
    }
    const user = getCurrentUser();
    setCurrentUser({ ...user, preferredLocations: locations });
    res.json({ success: true, preferredLocations: locations });
  });

  // PUT /api/users/me/methods
  app.put("/api/users/me/methods", (req, res) => {
    const { methods } = req.body || {};
    if (!Array.isArray(methods)) {
      return res.status(400).json({ error: "Expected { methods: [] }" });
    }
    const user = getCurrentUser();
    setCurrentUser({ ...user, preferredMethods: methods });
    res.json({ success: true, preferredMethods: methods });
  });

  return app;
}

/** Reset mock data to the original fixture before every test. */
function resetMockUser() {
  setCurrentUser({
    id: 1,
    username: "student123",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@nyu.edu",
    phone: "(123) 456-7890",
    major: "Computer Science",
    year: "Junior",
    bio: "Student looking for study partners for CS courses.",
    schedule: [
      { id: 1, name: "Operating Systems", time: "Monday 2:00 PM" },
      { id: 2, name: "Basic Algorithms", time: "Wednesday 4:00 PM" },
    ],
    preferredLocations: ["Bobst Library", "Kimmel Commuter Lounge"],
    preferredMethods: ["Group Study", "Practice Problems"],
  });
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe("User profile routes (/api/users/me)", function () {
  let app;

  beforeEach(function () {
    resetMockUser();
    app = buildApp();
  });

  // ── GET /api/users/me ──────────────────────────────────────────────────────

  describe("GET /api/users/me", function () {
    it("returns 200 with the current user object", async function () {
      const res = await request(app).get("/api/users/me");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
    });

    it("returns the correct username", async function () {
      const res = await request(app).get("/api/users/me");

      expect(res.body.username).to.equal("student123");
    });

    it("returns the correct email", async function () {
      const res = await request(app).get("/api/users/me");

      expect(res.body.email).to.equal("johndoe@nyu.edu");
    });

    it("returns a schedule array", async function () {
      const res = await request(app).get("/api/users/me");

      expect(res.body.schedule).to.be.an("array");
      expect(res.body.schedule).to.have.length(2);
    });

    it("returns preferredLocations array", async function () {
      const res = await request(app).get("/api/users/me");

      expect(res.body.preferredLocations).to.be.an("array");
      expect(res.body.preferredLocations).to.include("Bobst Library");
    });

    it("returns preferredMethods array", async function () {
      const res = await request(app).get("/api/users/me");

      expect(res.body.preferredMethods).to.be.an("array");
      expect(res.body.preferredMethods).to.include("Group Study");
    });
  });

  // ── PATCH /api/users/me ────────────────────────────────────────────────────

  describe("PATCH /api/users/me", function () {
    it("returns 200 with success: true", async function () {
      const res = await request(app)
        .patch("/api/users/me")
        .send({ firstName: "Jane" });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
    });

    it("updates firstName correctly", async function () {
      const res = await request(app)
        .patch("/api/users/me")
        .send({ firstName: "Jane" });

      expect(res.body.user.firstName).to.equal("Jane");
    });

    it("updates multiple fields at once", async function () {
      const res = await request(app)
        .patch("/api/users/me")
        .send({ major: "Mathematics", year: "Senior" });

      expect(res.body.user.major).to.equal("Mathematics");
      expect(res.body.user.year).to.equal("Senior");
    });

    it("does not overwrite fields that are not sent", async function () {
      const res = await request(app)
        .patch("/api/users/me")
        .send({ bio: "New bio" });

      expect(res.body.user.username).to.equal("student123");
      expect(res.body.user.email).to.equal("johndoe@nyu.edu");
    });

    it("persists the update so GET returns the new value", async function () {
      await request(app)
        .patch("/api/users/me")
        .send({ username: "updated_user" });

      const res = await request(app).get("/api/users/me");
      expect(res.body.username).to.equal("updated_user");
    });

    it("returns the full updated user object in the response", async function () {
      const res = await request(app)
        .patch("/api/users/me")
        .send({ phone: "555-0000" });

      expect(res.body.user).to.be.an("object");
      expect(res.body.user.phone).to.equal("555-0000");
    });
  });

  // ── PUT /api/users/me/schedule ─────────────────────────────────────────────

  describe("PUT /api/users/me/schedule", function () {
    it("returns 400 when body is not an array", async function () {
      const res = await request(app)
        .put("/api/users/me/schedule")
        .send({ name: "CS101" });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal("Expected an array of schedule items");
    });

    it("returns 200 with success: true for a valid array", async function () {
      const res = await request(app)
        .put("/api/users/me/schedule")
        .send([{ id: 10, name: "Data Structures", time: "10:00" }]);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
    });

    it("replaces the schedule with the provided items", async function () {
      const newSchedule = [
        { id: 10, name: "Data Structures", time: "10:00" },
        { id: 11, name: "Networks", time: "14:00" },
      ];

      const res = await request(app)
        .put("/api/users/me/schedule")
        .send(newSchedule);

      expect(res.body.schedule).to.have.length(2);
      expect(res.body.schedule[0].name).to.equal("Data Structures");
    });

    it("uses default values when name/time are omitted", async function () {
      const res = await request(app)
        .put("/api/users/me/schedule")
        .send([{ id: 99 }]);

      expect(res.body.schedule[0].name).to.equal("");
      expect(res.body.schedule[0].time).to.equal("09:00");
    });

    it("accepts an empty array and clears the schedule", async function () {
      const res = await request(app)
        .put("/api/users/me/schedule")
        .send([]);

      expect(res.status).to.equal(200);
      expect(res.body.schedule).to.deep.equal([]);
    });

    it("persists the new schedule so GET reflects the change", async function () {
      await request(app)
        .put("/api/users/me/schedule")
        .send([{ id: 5, name: "AI", time: "08:00" }]);

      const res = await request(app).get("/api/users/me");
      expect(res.body.schedule[0].name).to.equal("AI");
    });
  });

  // ── PUT /api/users/me/locations ────────────────────────────────────────────

  describe("PUT /api/users/me/locations", function () {
    it("returns 400 when locations is not an array", async function () {
      const res = await request(app)
        .put("/api/users/me/locations")
        .send({ locations: "Bobst" });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal("Expected { locations: [] }");
    });

    it("returns 400 when body is missing locations key", async function () {
      const res = await request(app)
        .put("/api/users/me/locations")
        .send({});

      expect(res.status).to.equal(400);
    });

    it("returns 200 with success: true for a valid locations array", async function () {
      const res = await request(app)
        .put("/api/users/me/locations")
        .send({ locations: ["Bobst Library"] });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
    });

    it("replaces preferredLocations with the new array", async function () {
      const res = await request(app)
        .put("/api/users/me/locations")
        .send({ locations: ["Kimmel Center", "Courant Institute"] });

      expect(res.body.preferredLocations).to.deep.equal([
        "Kimmel Center",
        "Courant Institute",
      ]);
    });

    it("accepts an empty array and clears locations", async function () {
      const res = await request(app)
        .put("/api/users/me/locations")
        .send({ locations: [] });

      expect(res.status).to.equal(200);
      expect(res.body.preferredLocations).to.deep.equal([]);
    });

    it("persists the new locations so GET reflects the change", async function () {
      await request(app)
        .put("/api/users/me/locations")
        .send({ locations: ["Silver Center"] });

      const res = await request(app).get("/api/users/me");
      expect(res.body.preferredLocations).to.include("Silver Center");
    });
  });

  // ── PUT /api/users/me/methods ──────────────────────────────────────────────

  describe("PUT /api/users/me/methods", function () {
    it("returns 400 when methods is not an array", async function () {
      const res = await request(app)
        .put("/api/users/me/methods")
        .send({ methods: "Flashcards" });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal("Expected { methods: [] }");
    });

    it("returns 400 when body is missing methods key", async function () {
      const res = await request(app)
        .put("/api/users/me/methods")
        .send({});

      expect(res.status).to.equal(400);
    });

    it("returns 200 with success: true for a valid methods array", async function () {
      const res = await request(app)
        .put("/api/users/me/methods")
        .send({ methods: ["Flashcards"] });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
    });

    it("replaces preferredMethods with the new array", async function () {
      const res = await request(app)
        .put("/api/users/me/methods")
        .send({ methods: ["Pomodoro", "Flashcards"] });

      expect(res.body.preferredMethods).to.deep.equal([
        "Pomodoro",
        "Flashcards",
      ]);
    });

    it("accepts an empty array and clears methods", async function () {
      const res = await request(app)
        .put("/api/users/me/methods")
        .send({ methods: [] });

      expect(res.status).to.equal(200);
      expect(res.body.preferredMethods).to.deep.equal([]);
    });

    it("persists the new methods so GET reflects the change", async function () {
      await request(app)
        .put("/api/users/me/methods")
        .send({ methods: ["Solo Study"] });

      const res = await request(app).get("/api/users/me");
      expect(res.body.preferredMethods).to.include("Solo Study");
    });
  });
});
