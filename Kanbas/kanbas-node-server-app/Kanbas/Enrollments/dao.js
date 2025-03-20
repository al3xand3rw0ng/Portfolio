import Database from "../Database/index.js";
export function getUserEnrollments(userId) {
  const { enrollments } = Database;
  const userEnrollments = enrollments.filter(
    (enrollment) => enrollment.user === userId
  );
  return userEnrollments;
}
export function enrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;
  enrollments.push({ _id: Date.now(), user: userId, course: courseId });
}
export function unenrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;
  const idx = enrollments.findIndex(
    (enrollment) => enrollment.user === userId && enrollment.course === courseId
  );
  if (idx === -1) {
    return { status: 404, message: "Enrollment not found" };
  }
  Database.enrollments = enrollments.filter(
    (enrollment) =>
      !(enrollment.user === userId && enrollment.course === courseId)
  );
  return { status: 200, message: "Unenrolled successfully" };
}
