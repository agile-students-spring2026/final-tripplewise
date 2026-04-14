const { expect } = require("chai");
const {
  calculateMatchPercentage,
  calculateScheduleOverlap,
  calculateLocationMatch,
  calculateMethodMatch,
  calculateSubjectOverlap,
} = require("../utils/matchingEngine");

describe("Matching Engine", () => {
  const baseUser = {
    id: 1,
    username: "student123",
    firstName: "John",
    lastName: "Doe",
    schedule: [
      { id: 1, name: "Operating Systems", time: "Monday 2:00 PM" },
      { id: 2, name: "Basic Algorithms", time: "Wednesday 4:00 PM" }
    ],
    preferredLocations: ["Bobst Library", "Kimmel Commuter Lounge"],
    preferredMethods: ["Group Study", "Practice Problems"]
  };

  describe("calculateScheduleOverlap", () => {
    it("should return 100 when schedules perfectly overlap", () => {
      const schedule1 = [
        { name: "OS", time: "Monday 2:00 PM" },
        { name: "Algorithms", time: "Wednesday 4:00 PM" }
      ];
      const schedule2 = [
        { name: "OS", time: "Monday 2:00 PM" },
        { name: "Algorithms", time: "Wednesday 4:00 PM" }
      ];
      const result = calculateScheduleOverlap(schedule1, schedule2);
      expect(result).to.equal(100);
    });

    it("should return 50 when one day overlaps out of two", () => {
      const schedule1 = [
        { name: "OS", time: "Monday 2:00 PM" },
        { name: "Algorithms", time: "Wednesday 4:00 PM" }
      ];
      const schedule2 = [
        { name: "OS", time: "Monday 2:00 PM" },
        { name: "Math", time: "Friday 10:00 AM" }
      ];
      const result = calculateScheduleOverlap(schedule1, schedule2);
      expect(result).to.equal(50);
    });

    it("should return 0 when no days overlap", () => {
      const schedule1 = [{ name: "OS", time: "Monday 2:00 PM" }];
      const schedule2 = [{ name: "Math", time: "Friday 10:00 AM" }];
      const result = calculateScheduleOverlap(schedule1, schedule2);
      expect(result).to.equal(0);
    });

    it("should return 0 when one schedule is empty", () => {
      const schedule1 = [{ name: "OS", time: "Monday 2:00 PM" }];
      const schedule2 = [];
      const result = calculateScheduleOverlap(schedule1, schedule2);
      expect(result).to.equal(0);
    });

    it("should return 0 when both schedules are empty", () => {
      const result = calculateScheduleOverlap([], []);
      expect(result).to.equal(0);
    });
  });

  describe("calculateLocationMatch", () => {
    it("should return 100 when locations perfectly match", () => {
      const locations1 = ["Bobst Library", "Kimmel Commuter Lounge"];
      const locations2 = ["Bobst Library", "Kimmel Commuter Lounge"];
      const result = calculateLocationMatch(locations1, locations2);
      expect(result).to.equal(100);
    });

    it("should return 50 when one location matches out of two", () => {
      const locations1 = ["Bobst Library", "NYU Library"];
      const locations2 = ["Bobst Library", "Kimmel Commuter Lounge"];
      const result = calculateLocationMatch(locations1, locations2);
      expect(result).to.be.closeTo(33.33, 0.1);
    });

    it("should return 0 when no locations match", () => {
      const locations1 = ["Bobst Library"];
      const locations2 = ["NYU Library"];
      const result = calculateLocationMatch(locations1, locations2);
      expect(result).to.equal(0);
    });

    it("should return 0 when one location array is empty", () => {
      const locations1 = ["Bobst Library"];
      const locations2 = [];
      const result = calculateLocationMatch(locations1, locations2);
      expect(result).to.equal(0);
    });
  });

  describe("calculateMethodMatch", () => {
    it("should return 100 when methods perfectly match", () => {
      const methods1 = ["Group Study", "Practice Problems"];
      const methods2 = ["Group Study", "Practice Problems"];
      const result = calculateMethodMatch(methods1, methods2);
      expect(result).to.equal(100);
    });

    it("should return 50 when one method matches out of two", () => {
      const methods1 = ["Group Study", "Tutoring"];
      const methods2 = ["Group Study", "Practice Problems"];
      const result = calculateMethodMatch(methods1, methods2);
      expect(result).to.be.closeTo(33.33, 0.1);
    });

    it("should return 0 when no methods match", () => {
      const methods1 = ["Group Study"];
      const methods2 = ["Virtual"];
      const result = calculateMethodMatch(methods1, methods2);
      expect(result).to.equal(0);
    });

    it("should return 0 when one method array is empty", () => {
      const methods1 = ["Group Study"];
      const methods2 = [];
      const result = calculateMethodMatch(methods1, methods2);
      expect(result).to.equal(0);
    });
  });

  describe("calculateSubjectOverlap", () => {
    it("should return 100 when subjects perfectly match", () => {
      const schedule1 = [{ name: "Operating Systems", time: "Monday 2:00 PM" }];
      const schedule2 = [{ name: "Operating Systems", time: "Monday 2:00 PM" }];
      const result = calculateSubjectOverlap(schedule1, schedule2);
      expect(result).to.equal(100);
    });

    it("should return 50 when one subject matches out of two", () => {
      const schedule1 = [
        { name: "Operating Systems", time: "Monday 2:00 PM" },
        { name: "Algorithms", time: "Wednesday 4:00 PM" }
      ];
      const schedule2 = [
        { name: "Operating Systems", time: "Monday 2:00 PM" },
        { name: "Math", time: "Friday 10:00 AM" }
      ];
      const result = calculateSubjectOverlap(schedule1, schedule2);
      expect(result).to.equal(50);
    });

    it("should return 0 when no subjects match", () => {
      const schedule1 = [{ name: "Operating Systems", time: "Monday 2:00 PM" }];
      const schedule2 = [{ name: "Math", time: "Friday 10:00 AM" }];
      const result = calculateSubjectOverlap(schedule1, schedule2);
      expect(result).to.equal(0);
    });

    it("should handle partial subject name matches", () => {
      const schedule1 = [{ name: "Algorithms", time: "Monday 2:00 PM" }];
      const schedule2 = [{ name: "Basic Algorithms", time: "Monday 2:00 PM" }];
      const result = calculateSubjectOverlap(schedule1, schedule2);
      expect(result).to.equal(100);
    });

    it("should return 0 when schedules are empty", () => {
      const result = calculateSubjectOverlap([], []);
      expect(result).to.equal(0);
    });
  });

  describe("calculateMatchPercentage", () => {
    it("should return 0 when either user is null", () => {
      const result1 = calculateMatchPercentage(null, baseUser);
      const result2 = calculateMatchPercentage(baseUser, null);
      const result3 = calculateMatchPercentage(null, null);
      
      expect(result1).to.equal(0);
      expect(result2).to.equal(0);
      expect(result3).to.equal(0);
    });

    it("should return 100 when users have identical profiles", () => {
      const result = calculateMatchPercentage(baseUser, baseUser);
      expect(result).to.equal(100);
    });

    it("should return correct weighted score", () => {
      const user1 = {
        schedule: [{ name: "OS", time: "Monday 2:00 PM" }],
        preferredLocations: ["Bobst Library"],
        preferredMethods: ["Group Study"]
      };
      const user2 = {
        schedule: [{ name: "OS", time: "Monday 2:00 PM" }],
        preferredLocations: ["Bobst Library"],
        preferredMethods: ["Group Study"]
      };
      const result = calculateMatchPercentage(user1, user2);
      // All factors at 100: (100*0.4) + (100*0.3) + (100*0.2) + (100*0.1) = 100
      expect(result).to.equal(100);
    });

    it("should calculate correct score with partial matches", () => {
      const user1 = {
        schedule: [
          { name: "OS", time: "Monday 2:00 PM" },
          { name: "Algorithms", time: "Wednesday 4:00 PM" }
        ],
        preferredLocations: ["Bobst Library", "NYU Library"],
        preferredMethods: ["Group Study", "Tutoring"]
      };
      const user2 = {
        schedule: [
          { name: "OS", time: "Monday 2:00 PM" },
          { name: "Math", time: "Friday 10:00 AM" }
        ],
        preferredLocations: ["Bobst Library", "Kimmel Commuter Lounge"],
        preferredMethods: ["Group Study", "Practice Problems"]
      };
      const result = calculateMatchPercentage(user1, user2);
      // Schedule: 50%, Location: 33%, Method: 33%, Subject: 50%
      // (50*0.4) + (33*0.3) + (33*0.2) + (50*0.1) = 20 + 9.9 + 6.6 + 5 = 41.5 ≈ 42
      expect(result).to.be.within(40, 43);
    });

    it("should return low score for mismatched profiles", () => {
      const user1 = {
        schedule: [{ name: "OS", time: "Monday 2:00 PM" }],
        preferredLocations: ["Bobst Library"],
        preferredMethods: ["Group Study"]
      };
      const user2 = {
        schedule: [{ name: "Math", time: "Friday 10:00 AM" }],
        preferredLocations: ["NYU Library"],
        preferredMethods: ["Virtual"]
      };
      const result = calculateMatchPercentage(user1, user2);
      expect(result).to.be.below(25);
    });

    it("should handle users with empty profile fields", () => {
      const user1 = {
        schedule: [],
        preferredLocations: [],
        preferredMethods: []
      };
      const user2 = baseUser;
      const result = calculateMatchPercentage(user1, user2);
      expect(result).to.equal(0);
    });

    it("should be symmetric (A vs B = B vs A)", () => {
      const user1 = {
        schedule: [{ name: "OS", time: "Monday 2:00 PM" }],
        preferredLocations: ["Bobst Library"],
        preferredMethods: ["Group Study"]
      };
      const user2 = {
        schedule: [{ name: "OS", time: "Monday 2:00 PM" }],
        preferredLocations: ["NYU Library"],
        preferredMethods: ["Virtual"]
      };
      const result1 = calculateMatchPercentage(user1, user2);
      const result2 = calculateMatchPercentage(user2, user1);
      expect(result1).to.equal(result2);
    });
  });
});
