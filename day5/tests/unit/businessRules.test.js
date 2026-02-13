// tests/unit/businessRules.test.js
const {
  canMarkAsDone,
  isOverdue,
  calculateCompletionRate,
  getPriorityScore,
  isDueSoon
} = require('../../src/utils/businessRules');

describe('Business Rules', () => {
  
  describe('canMarkAsDone', () => {
    
    // ✅ Positive Tests
    test('should allow marking pending todo as done', () => {
      const todo = { task: 'Test', done: false };
      expect(canMarkAsDone(todo)).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should not allow marking already done todo', () => {
      const todo = { task: 'Test', done: true };
      expect(canMarkAsDone(todo)).toBe(false);
    });
    
    test('should return false for null todo', () => {
      expect(canMarkAsDone(null)).toBe(false);
    });
    
    test('should return false for undefined todo', () => {
      expect(canMarkAsDone(undefined)).toBe(false);
    });
  });
  
  describe('isOverdue', () => {
    
    // ✅ Positive Tests
    test('should detect overdue todo', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: yesterday.toISOString()
      };
      
      expect(isOverdue(todo)).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should return false for todo without due date', () => {
      const todo = { task: 'Test', done: false };
      expect(isOverdue(todo)).toBe(false);
    });
    
    test('should return false for completed todo', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const todo = {
        task: 'Test',
        done: true,
        dueDate: yesterday.toISOString()
      };
      
      expect(isOverdue(todo)).toBe(false);
    });
    
    test('should return false for future due date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: tomorrow.toISOString()
      };
      
      expect(isOverdue(todo)).toBe(false);
    });
    
    test('should return false for null todo', () => {
      expect(isOverdue(null)).toBe(false);
    });
    
    // 🔍 Boundary Tests
    test('should detect todo due 1 minute ago', () => {
      const oneMinuteAgo = new Date();
      oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: oneMinuteAgo.toISOString()
      };
      
      expect(isOverdue(todo)).toBe(true);
    });
  });
  
  describe('calculateCompletionRate', () => {
    
    // ✅ Positive Tests
    test('should calculate 100% when all done', () => {
      const todos = [
        { task: 'Task 1', done: true },
        { task: 'Task 2', done: true },
        { task: 'Task 3', done: true }
      ];
      
      expect(calculateCompletionRate(todos)).toBe(100);
    });
    
    test('should calculate 0% when none done', () => {
      const todos = [
        { task: 'Task 1', done: false },
        { task: 'Task 2', done: false },
        { task: 'Task 3', done: false }
      ];
      
      expect(calculateCompletionRate(todos)).toBe(0);
    });
    
    test('should calculate 50% when half done', () => {
      const todos = [
        { task: 'Task 1', done: true },
        { task: 'Task 2', done: false }
      ];
      
      expect(calculateCompletionRate(todos)).toBe(50);
    });
    
    test('should round to nearest integer', () => {
      const todos = [
        { task: 'Task 1', done: true },
        { task: 'Task 2', done: false },
        { task: 'Task 3', done: false }
      ];
      
      // 1/3 = 33.33... → should round to 33
      expect(calculateCompletionRate(todos)).toBe(33);
    });
    
    // ❌ Negative Tests
    test('should return 0 for empty array', () => {
      expect(calculateCompletionRate([])).toBe(0);
    });
    
    test('should return 0 for null', () => {
      expect(calculateCompletionRate(null)).toBe(0);
    });
    
    test('should return 0 for non-array', () => {
      expect(calculateCompletionRate('not array')).toBe(0);
    });
    
    // 🔍 Boundary Tests
    test('should calculate correctly with 1 todo', () => {
      expect(calculateCompletionRate([{ done: true }])).toBe(100);
      expect(calculateCompletionRate([{ done: false }])).toBe(0);
    });
  });
  
  describe('getPriorityScore', () => {
    
    // ✅ Positive Tests
    test('should return correct score for each priority', () => {
      expect(getPriorityScore('high')).toBe(3);
      expect(getPriorityScore('medium')).toBe(2);
      expect(getPriorityScore('low')).toBe(1);
    });
    
    // ❌ Negative Tests
    test('should return 0 for invalid priority', () => {
      expect(getPriorityScore('urgent')).toBe(0);
      expect(getPriorityScore('')).toBe(0);
      expect(getPriorityScore(null)).toBe(0);
      expect(getPriorityScore(undefined)).toBe(0);
    });
  });
  
  describe('isDueSoon', () => {
    
    // ✅ Positive Tests
    test('should detect todo due in 12 hours', () => {
      const in12Hours = new Date();
      in12Hours.setHours(in12Hours.getHours() + 12);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: in12Hours.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(true);
    });
    
    test('should detect todo due in 1 hour', () => {
      const in1Hour = new Date();
      in1Hour.setHours(in1Hour.getHours() + 1);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: in1Hour.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should return false for todo without due date', () => {
      const todo = { task: 'Test', done: false };
      expect(isDueSoon(todo)).toBe(false);
    });
    
    test('should return false for completed todo', () => {
      const in12Hours = new Date();
      in12Hours.setHours(in12Hours.getHours() + 12);
      
      const todo = {
        task: 'Test',
        done: true,
        dueDate: in12Hours.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(false);
    });
    
    test('should return false for todo due in 25+ hours', () => {
      const in25Hours = new Date();
      in25Hours.setHours(in25Hours.getHours() + 25);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: in25Hours.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(false);
    });
    
    test('should return false for overdue todo', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: yesterday.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(false);
    });
    
    // 🔍 Boundary Tests
    test('should detect todo due in exactly 24 hours', () => {
      const in24Hours = new Date();
      in24Hours.setHours(in24Hours.getHours() + 24);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: in24Hours.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(true);
    });
    
    test('should not detect todo due in 24.1 hours', () => {
      const in24Point1Hours = new Date();
      in24Point1Hours.setHours(in24Point1Hours.getHours() + 24);
      in24Point1Hours.setMinutes(in24Point1Hours.getMinutes() + 6);
      
      const todo = {
        task: 'Test',
        done: false,
        dueDate: in24Point1Hours.toISOString()
      };
      
      expect(isDueSoon(todo)).toBe(false);
    });
  });
});