/**
 * Calculate match percentage between two users
 * Database-agnostic: accepts user objects, doesn't fetch from database
 *
 * Based on:
 * - Schedule overlap (40%)
 * - Location compatibility (30%)
 * - Method compatibility (20%)
 * - Subject overlap (10%)
 *
 * If a factor cannot be calculated (missing data on either side),
 * its weight is redistributed proportionally among the remaining factors.
 *
 * @param {Object} user1 - First user profile
 * @param {Object} user2 - Second user profile
 * @returns {number} Match percentage (0-100)
 */
function calculateMatchPercentage(user1, user2) {
  if (!user1 || !user2) return 0;

  const factors = [];

  // 1. Schedule Overlap (40% weight)
  const hasSchedule = user1.schedule?.length && user2.schedule?.length;
  if (hasSchedule) {
    factors.push({
      score: calculateScheduleOverlap(user1.schedule, user2.schedule),
      weight: 0.4,
    });
  }

  // 2. Location Compatibility (30% weight)
  const hasLocations = user1.preferredLocations?.length && user2.preferredLocations?.length;
  if (hasLocations) {
    factors.push({
      score: calculateLocationMatch(user1.preferredLocations, user2.preferredLocations),
      weight: 0.3,
    });
  }

  // 3. Method Compatibility (20% weight)
  const hasMethods = user1.preferredMethods?.length && user2.preferredMethods?.length;
  if (hasMethods) {
    factors.push({
      score: calculateMethodMatch(user1.preferredMethods, user2.preferredMethods),
      weight: 0.2,
    });
  }

  // 4. Subject/Class Overlap (10% weight)
  const hasSubjects = user1.schedule?.length && user2.schedule?.length;
  if (hasSubjects) {
    factors.push({
      score: calculateSubjectOverlap(user1.schedule, user2.schedule),
      weight: 0.1,
    });
  }

  // If no factors available, return 0
  if (factors.length === 0) return 0;

  // Redistribute weights proportionally so they always sum to 1
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const matchScore = factors.reduce((sum, f) => sum + f.score * (f.weight / totalWeight), 0);

  return Math.round(matchScore);
}

/**
 * Calculate schedule overlap percentage
 * Returns 0-100 based on common days
 * Supports both new format { day, time } and old format { time: "Monday 2:00 PM" }
 */
function calculateScheduleOverlap(schedule1, schedule2) {
  if (!schedule1?.length || !schedule2?.length) return 0;

  let matches = 0;
  schedule1.forEach(item1 => {
    const day1 = item1.day || extractDay(item1.time);
    schedule2.forEach(item2 => {
      const day2 = item2.day || extractDay(item2.time);
      if (day1 && day2 && day1 === day2) {
        matches++;
      }
    });
  });

  const maxPossible = Math.max(schedule1.length, schedule2.length);
  return (matches / maxPossible) * 100;
}

/**
 * Calculate location match percentage
 * Returns 0-100 based on common preferred locations
 */
function calculateLocationMatch(locations1, locations2) {
  if (!locations1?.length || !locations2?.length) return 0;

  const common = locations1.filter(loc => locations2.includes(loc));
  const union = new Set([...locations1, ...locations2]).size;

  return (common.length / union) * 100;
}

/**
 * Calculate method match percentage
 * Returns 0-100 based on common study methods
 */
function calculateMethodMatch(methods1, methods2) {
  if (!methods1?.length || !methods2?.length) return 0;

  const common = methods1.filter(method => methods2.includes(method));
  const union = new Set([...methods1, ...methods2]).size;

  return (common.length / union) * 100;
}

/**
 * Calculate subject overlap percentage
 * Returns 0-100 based on common classes/subjects
 */
function calculateSubjectOverlap(schedule1, schedule2) {
  if (!schedule1?.length || !schedule2?.length) return 0;

  const subjects1 = schedule1.map(s => s.name.toLowerCase());
  const subjects2 = schedule2.map(s => s.name.toLowerCase());

  const common = subjects1.filter(subj =>
    subjects2.some(s => s.includes(subj) || subj.includes(s))
  );

  const maxPossible = Math.max(subjects1.length, subjects2.length);
  return (common.length / maxPossible) * 100;
}

/**
 * Extract day from time string
 * e.g., "Monday 2:00 PM" -> "Monday"
 */
function extractDay(timeStr) {
  if (!timeStr) return "";
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];
  for (const day of days) {
    if (timeStr.includes(day)) return day;
  }
  return "";
}

module.exports = {
  calculateMatchPercentage,
  calculateScheduleOverlap,
  calculateLocationMatch,
  calculateMethodMatch,
  calculateSubjectOverlap,
};
