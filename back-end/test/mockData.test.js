const { expect } = require("chai");
const { getCurrentUser, setCurrentUser } = require("../data/mockData");

describe("mockData", function () {
  beforeEach(function () {
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
        { id: 2, name: "Basic Algorithms", time: "Wednesday 4:00 PM" }
      ],
      preferredLocations: [
        "Bobst Library",
        "Kimmel Commuter Lounge"
      ],
      preferredMethods: [
        "Group Study",
        "Practice Problems"
      ]
    });
  });

  it("returns the current user", function () {
    const user = getCurrentUser();

    expect(user).to.be.an("object");
    expect(user.username).to.equal("student123");
    expect(user.password).to.equal("password123");
  });

  it("updates the current user", function () {
    const newUser = {
      id: 99,
      username: "newstudent",
      password: "newpassword"
    };

    setCurrentUser(newUser);

    const updatedUser = getCurrentUser();
    expect(updatedUser).to.deep.equal(newUser);
  });
});