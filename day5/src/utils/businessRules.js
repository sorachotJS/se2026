// src/utils/businessRules.js

/**
 * Check if todo can be marked as done
 */
function canMarkAsDone(todo) {
  if (!todo) {
    return false;
  }
  
  // Already done
  if (todo.done) {
    return false;
  }
  
  return true;
}

/**
 * Check if todo is overdue
 */
function isOverdue(todo) {
  if (!todo || !todo.dueDate) {
    return false;
  }
  
  if (todo.done) {
    return false;
  }
  
  const now = new Date();
  const dueDate = new Date(todo.dueDate);
  
  return dueDate < now;
}

/**
 * Calculate completion rate
 */
function calculateCompletionRate(todos) {
  if (!Array.isArray(todos) || todos.length === 0) {
    return 0;
  }
  
  const completedCount = todos.filter(t => t.done).length;
  return Math.round((completedCount / todos.length) * 100);
}

/**
 * Get priority score (for sorting)
 */
function getPriorityScore(priority) {
  const scores = {
    high: 3,
    medium: 2,
    low: 1
  };
  
  return scores[priority] || 0;
}

/**
 * Check if task is due soon (within 24 hours)
 */
function isDueSoon(todo) {
  if (!todo || !todo.dueDate || todo.done) {
    return false;
  }
  
  const now = new Date();
  const dueDate = new Date(todo.dueDate);
  const hoursDiff = (dueDate - now) / (1000 * 60 * 60);
  
  return hoursDiff > 0 && hoursDiff <= 24;
}

module.exports = {
  canMarkAsDone,
  isOverdue,
  calculateCompletionRate,
  getPriorityScore,
  isDueSoon
};