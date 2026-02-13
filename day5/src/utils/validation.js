// src/utils/validation.js

/**
 * Validate todo task
 */
function validateTask(task) {
    if (task === null || task === undefined) {
    throw new Error('Task is required');
  }
  
  if (typeof task !== 'string') {
    throw new Error('Task must be a string');
  }
  
  if (task.trim().length === 0) {
    throw new Error('Task cannot be empty');
  }
  
  if (task.length < 3) {
    throw new Error('Task must be at least 3 characters');
  }
  
  if (task.length > 500) {
    throw new Error('Task must not exceed 500 characters');
  }
  
  return true;
}

/**
 * Validate priority
 */
function isValidPriority(priority) {
  const validPriorities = ['low', 'medium', 'high'];
  return validPriorities.includes(priority);
}

/**
 * Validate due date
 */
function validateDueDate(dueDate) {
  if (!dueDate) {
    return true; // Due date is optional
  }
  
  const date = new Date(dueDate);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  
  const now = new Date();
  if (date < now) {
    throw new Error('Due date cannot be in the past');
  }
  
  return true;
}

/**
 * Validate complete todo object
 */
function validateTodo(todo) {
  const errors = [];
  
  try {
    validateTask(todo.task);
  } catch (error) {
    errors.push(error.message);
  }
  
  if (todo.priority && !isValidPriority(todo.priority)) {
    errors.push('Priority must be low, medium, or high');
  }
  
  try {
    if (todo.dueDate) {
      validateDueDate(todo.dueDate);
    }
  } catch (error) {
    errors.push(error.message);
  }
  
  if (errors.length > 0) {
    return {
      valid: false,
      errors
    };
  }
  
  return {
    valid: true,
    errors: []
  };
}

module.exports = {
  validateTask,
  isValidPriority,
  validateDueDate,
  validateTodo
};