// tests/unit/dataProcessing.test.js
const {
  filterTodosByStatus,
  sortTodosByPriority,
  searchTodos,
  groupTodosByPriority,
  paginateTodos
} = require('../../src/utils/dataProcessing');

describe('Data Processing', () => {
  
  // Sample data
  const sampleTodos = [
    { id: 1, task: 'Buy milk', priority: 'high', done: false },
    { id: 2, task: 'Read book', priority: 'low', done: true },
    { id: 3, task: 'Exercise', priority: 'medium', done: false },
    { id: 4, task: 'Pay bills', priority: 'high', done: false },
    { id: 5, task: 'Clean house', priority: 'medium', done: true }
  ];
  
  describe('filterTodosByStatus', () => {
    
    // ✅ Positive Tests
    test('should filter pending todos', () => {
      const result = filterTodosByStatus(sampleTodos, false);
      expect(result).toHaveLength(3);
      expect(result.every(t => !t.done)).toBe(true);
    });
    
    test('should filter completed todos', () => {
      const result = filterTodosByStatus(sampleTodos, true);
      expect(result).toHaveLength(2);
      expect(result.every(t => t.done)).toBe(true);
    });
    
    test('should return all when done is undefined', () => {
      const result = filterTodosByStatus(sampleTodos, undefined);
      expect(result).toHaveLength(5);
    });
    
    test('should handle string "true"', () => {
      const result = filterTodosByStatus(sampleTodos, 'true');
      expect(result).toHaveLength(2);
      expect(result.every(t => t.done)).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should return empty array for non-array input', () => {
      expect(filterTodosByStatus(null, true)).toEqual([]);
      expect(filterTodosByStatus('string', true)).toEqual([]);
    });
    
    test('should return empty array for empty array', () => {
      expect(filterTodosByStatus([], true)).toEqual([]);
    });
  });
  
  describe('sortTodosByPriority', () => {
    
    // ✅ Positive Tests
    test('should sort by priority descending (high first)', () => {
      const result = sortTodosByPriority(sampleTodos, 'desc');
      expect(result[0].priority).toBe('high');
      expect(result[1].priority).toBe('high');
      expect(result[result.length - 1].priority).toBe('low');
    });
    
    test('should sort by priority ascending (low first)', () => {
      const result = sortTodosByPriority(sampleTodos, 'asc');
      expect(result[0].priority).toBe('low');
      expect(result[result.length - 1].priority).toBe('high');
    });
    
    test('should not mutate original array', () => {
      const original = [...sampleTodos];
      sortTodosByPriority(sampleTodos, 'desc');
      expect(sampleTodos).toEqual(original);
    });
    
    test('should handle todos without priority (default to low)', () => {
      const todos = [
        { id: 1, task: 'Task 1' },
        { id: 2, task: 'Task 2', priority: 'high' }
      ];
      
      const result = sortTodosByPriority(todos, 'desc');
      expect(result[0].priority).toBe('high');
    });
    
    // ❌ Negative Tests
    test('should return empty array for non-array input', () => {
      expect(sortTodosByPriority(null)).toEqual([]);
      expect(sortTodosByPriority(undefined)).toEqual([]);
    });
    
    test('should return empty array for empty array', () => {
      expect(sortTodosByPriority([])).toEqual([]);
    });
  });
  
  describe('searchTodos', () => {
    
    // ✅ Positive Tests
    test('should find todos containing keyword', () => {
      const result = searchTodos(sampleTodos, 'book');
      expect(result).toHaveLength(1);
      expect(result[0].task).toBe('Read book');
    });
    
    test('should be case-insensitive', () => {
      const result = searchTodos(sampleTodos, 'MILK');
      expect(result).toHaveLength(1);
      expect(result[0].task).toBe('Buy milk');
    });
    
    test('should find multiple matches', () => {
      const todos = [
        { task: 'Buy milk' },
        { task: 'Buy bread' },
        { task: 'Read book' }
      ];
      
      const result = searchTodos(todos, 'buy');
      expect(result).toHaveLength(2);
    });
    
    test('should trim keyword', () => {
      const result = searchTodos(sampleTodos, '  milk  ');
      expect(result).toHaveLength(1);
    });
    
    // ❌ Negative Tests
    test('should return empty array when no matches', () => {
      const result = searchTodos(sampleTodos, 'nonexistent');
      expect(result).toEqual([]);
    });
    
    test('should return all todos when keyword is empty', () => {
      expect(searchTodos(sampleTodos, '')).toEqual(sampleTodos);
    });
    
    test('should return all todos when keyword is null', () => {
      expect(searchTodos(sampleTodos, null)).toEqual(sampleTodos);
    });
    
    test('should return empty array for non-array input', () => {
      expect(searchTodos(null, 'test')).toEqual([]);
    });
  });
  
  describe('groupTodosByPriority', () => {
    
    // ✅ Positive Tests
    test('should group todos by priority', () => {
      const result = groupTodosByPriority(sampleTodos);
      
      expect(result.high).toHaveLength(2);
      expect(result.medium).toHaveLength(2);
      expect(result.low).toHaveLength(1);
    });
    
    test('should handle todos without priority (default to low)', () => {
      const todos = [
        { id: 1, task: 'Task 1' },
        { id: 2, task: 'Task 2', priority: 'high' }
      ];
      
      const result = groupTodosByPriority(todos);
      expect(result.low).toHaveLength(1);
      expect(result.high).toHaveLength(1);
    });
    
    // ❌ Negative Tests
    test('should return empty groups for non-array input', () => {
      const result = groupTodosByPriority(null);
      expect(result).toEqual({ high: [], medium: [], low: [] });
    });
    
    test('should return empty groups for empty array', () => {
      const result = groupTodosByPriority([]);
      expect(result).toEqual({ high: [], medium: [], low: [] });
    });
  });
  
  describe('paginateTodos', () => {
    
    // Setup: 25 todos
    const manyTodos = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      task: `Task ${i + 1}`,
      done: false
    }));
    
    // ✅ Positive Tests
    test('should paginate correctly (page 1)', () => {
      const result = paginateTodos(manyTodos, 1, 10);
      
      expect(result.data).toHaveLength(10);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(25);
      expect(result.totalPages).toBe(3);
      expect(result.data[0].id).toBe(1);
    });
    
    test('should paginate correctly (page 2)', () => {
      const result = paginateTodos(manyTodos, 2, 10);
      
      expect(result.data).toHaveLength(10);
      expect(result.page).toBe(2);
      expect(result.data[0].id).toBe(11);
    });
    
    test('should paginate correctly (last page)', () => {
      const result = paginateTodos(manyTodos, 3, 10);
      
      expect(result.data).toHaveLength(5); // remaining items
      expect(result.page).toBe(3);
      expect(result.data[0].id).toBe(21);
    });
    
    test('should use default page and limit', () => {
      const result = paginateTodos(manyTodos);
      
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
    
    // ❌ Negative Tests
    test('should return empty result for non-array input', () => {
      const result = paginateTodos(null, 1, 10);
      
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
    
    test('should return empty data for page beyond total', () => {
      const result = paginateTodos(manyTodos, 10, 10);
      
      expect(result.data).toEqual([]);
      expect(result.page).toBe(10);
    });
    
    // 🔍 Boundary Tests
    test('should handle single item', () => {
      const result = paginateTodos([{ id: 1 }], 1, 10);
      
      expect(result.data).toHaveLength(1);
      expect(result.totalPages).toBe(1);
    });
    
    test('should handle exact page size', () => {
      const todos = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));
      const result = paginateTodos(todos, 1, 10);
      
      expect(result.data).toHaveLength(10);
      expect(result.totalPages).toBe(1);
    });
  });
});