import Database from "../Database/index.js";
export function findAssignmentsForCourse(course) {
  const { assignments } = Database;
  const assignmentsForCourse = assignments.filter(
    (assingment) => assingment.course === course
  );
  return assignmentsForCourse;
}
export function createAssignment(assingment) {
  const newAssignment = { ...assingment, _id: Date.now().toString() };
  Database.assignments = [...Database.assignments, newAssignment];
  return newAssignment;
}
export function deletAssignment(assignmentId) {
  const { assignments } = Database;
  Database.assignments = assignments.filter(
    (assingment) => assingment._id !== assignmentId
  );
}
export function updateAssignment(assignmentId, assingmentUpdates) {
  const { assignments } = Database;
  const assingment = assignments.find(
    (assingment) => assingment._id === assignmentId
  );
  Object.assign(assingment, assingmentUpdates);
  return assingment;
}
