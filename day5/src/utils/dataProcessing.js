// src/utils/dataProcessing.js
const { getPriorityScore } = require('./businessRules');

/**
 * Filter todos by status
 */
function filterTodosByStatus(todos, done) {
  if (!Array.isArray(todos)) {
    return [];
  }
  
  if (done === undefined || done === null) {
    return todos;
  }
  
  const isDone = done === true || done === 'true';
  return todos.filter(t => t.done === isDone);
}

/**
 * Sort todos by priority
 */
function sortTodosByPriority(todos, order = 'desc') {
  if (!Array.isArray(todos)) {
    return [];
  }
  
  const sorted = [...todos].sort((a, b) => {
    const scoreA = getPriorityScore(a.priority || 'low');
    const scoreB = getPriorityScore(b.priority || 'low');
    
    if (order === 'asc') {
      return scoreA - scoreB;
    }
    return scoreB - scoreA;
  });
  
  return sorted;
}

/**
 * Search todos by keyword
 */
function searchTodos(todos, keyword) {
  if (!Array.isArray(todos) || !keyword) {
    return todos || [];
  }
  
  const lowerKeyword = keyword.toLowerCase().trim();
  
  return todos.filter(todo => {
    const taskMatch = todo.task.toLowerCase().includes(lowerKeyword);
    return taskMatch;
  });
}

/**
 * Group todos by priority
 */
function groupTodosByPriority(todos) {
  if (!Array.isArray(todos)) {
    return { high: [], medium: [], low: [] };
  }
  
  return todos.reduce((groups, todo) => {
    const priority = todo.priority || 'low';
    if (!groups[priority]) {
      groups[priority] = [];
    }
    groups[priority].push(todo);
    return groups;
  }, { high: [], medium: [], low: [] });
}

/**
 * Paginate todos
 */
function paginateTodos(todos, page = 1, limit = 10) {
  if (!Array.isArray(todos)) {
    return {
      data: [],
      page: 1,
      limit,
      total: 0,
      totalPages: 0
    };
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = todos.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    page,
    limit,
    total: todos.length,
    totalPages: Math.ceil(todos.length / limit)
  };
}

module.exports = {
  filterTodosByStatus,
  sortTodosByPriority,
  searchTodos,
  groupTodosByPriority,
  paginateTodos
};