// tests/unit/validation.test.js
const {
  validateTask,
  isValidPriority,
  validateDueDate,
  validateTodo
} = require('../../src/utils/validation');

describe('Validation Utils', () => {
  
  describe('validateTask', () => {
    
    // ✅ Positive Tests
    test('should accept valid task', () => {
      expect(validateTask('Buy groceries')).toBe(true);
    });
    
    test('should accept task with minimum length', () => {
      expect(validateTask('Buy')).toBe(true);
    });
    
    test('should accept task with maximum length', () => {
      const longTask = 'a'.repeat(500);
      expect(validateTask(longTask)).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should reject empty task', () => {
      expect(() => validateTask('')).toThrow('Task cannot be empty');
    });
    
    test('should reject task with only spaces', () => {
      expect(() => validateTask('   ')).toThrow('Task cannot be empty');
    });
    
    test('should reject null task', () => {
      expect(() => validateTask(null)).toThrow('Task is required');
    });
    
    test('should reject undefined task', () => {
      expect(() => validateTask(undefined)).toThrow('Task is required');
    });
    
    test('should reject non-string task', () => {
      expect(() => validateTask(123)).toThrow('Task must be a string');
      expect(() => validateTask({})).toThrow('Task must be a string');
      expect(() => validateTask([])).toThrow('Task must be a string');
    });
    
    // 🔍 Boundary Tests
    test('should reject task shorter than 3 characters', () => {
      expect(() => validateTask('ab')).toThrow('Task must be at least 3 characters');
    });
    
    test('should reject task longer than 500 characters', () => {
      const tooLongTask = 'a'.repeat(501);
      expect(() => validateTask(tooLongTask))
        .toThrow('Task must not exceed 500 characters');
    });
    
    test('should accept task with exactly 3 characters', () => {
      expect(validateTask('abc')).toBe(true);
    });
    
    test('should accept task with exactly 500 characters', () => {
      const maxTask = 'a'.repeat(500);
      expect(validateTask(maxTask)).toBe(true);
    });
  });
  
  describe('isValidPriority', () => {
    
    // ✅ Positive Tests
    test('should accept "low" priority', () => {
      expect(isValidPriority('low')).toBe(true);
    });
    
    test('should accept "medium" priority', () => {
      expect(isValidPriority('medium')).toBe(true);
    });
    
    test('should accept "high" priority', () => {
      expect(isValidPriority('high')).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should reject invalid priority', () => {
      expect(isValidPriority('urgent')).toBe(false);
      expect(isValidPriority('normal')).toBe(false);
      expect(isValidPriority('')).toBe(false);
    });
    
    test('should reject case-sensitive priority', () => {
      expect(isValidPriority('Low')).toBe(false);
      expect(isValidPriority('HIGH')).toBe(false);
    });
    
    test('should reject non-string priority', () => {
      expect(isValidPriority(null)).toBe(false);
      expect(isValidPriority(undefined)).toBe(false);
      expect(isValidPriority(123)).toBe(false);
    });
  });
  
  describe('validateDueDate', () => {
    
    // ✅ Positive Tests
    test('should accept null due date (optional)', () => {
      expect(validateDueDate(null)).toBe(true);
    });
    
    test('should accept undefined due date (optional)', () => {
      expect(validateDueDate(undefined)).toBe(true);
    });
    
    test('should accept future date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(validateDueDate(tomorrow.toISOString())).toBe(true);
    });
    
    test('should accept date far in future', () => {
      const futureDate = new Date('2030-12-31');
      expect(validateDueDate(futureDate.toISOString())).toBe(true);
    });
    
    // ❌ Negative Tests
    test('should reject past date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(() => validateDueDate(yesterday.toISOString()))
        .toThrow('Due date cannot be in the past');
    });
    
    test('should reject invalid date format', () => {
      expect(() => validateDueDate('invalid-date'))
        .toThrow('Invalid date format');
      expect(() => validateDueDate('2024-13-45'))
        .toThrow('Invalid date format');
    });
    
    // 🔍 Boundary Tests
    test('should accept today as due date', () => {
      const today = new Date();
      // Set to end of day to ensure it's in future
      today.setHours(23, 59, 59, 999);
      expect(validateDueDate(today.toISOString())).toBe(true);
    });
  });
  
  describe('validateTodo', () => {
    
    // ✅ Positive Tests
    test('should validate complete valid todo', () => {
      const todo = {
        task: 'Buy groceries',
        priority: 'medium',
        dueDate: new Date('2030-12-31').toISOString()
      };
      
      const result = validateTodo(todo);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should validate todo without optional fields', () => {
      const todo = {
        task: 'Simple task'
      };
      
      const result = validateTodo(todo);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    // ❌ Negative Tests
    test('should collect all validation errors', () => {
      const todo = {
        task: '',
        priority: 'invalid',
        dueDate: 'invalid-date'
      };
      
      const result = validateTodo(todo);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('Task cannot be empty');
      expect(result.errors).toContain('Priority must be low, medium, or high');
      expect(result.errors).toContain('Invalid date format');
    });
    
    test('should validate todo with multiple errors', () => {
      const todo = {
        task: 'ab', // too short
        priority: 'urgent', // invalid
      };
      
      const result = validateTodo(todo);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });
});