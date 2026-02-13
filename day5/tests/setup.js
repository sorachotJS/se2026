// tests/setup.js

/**
 * Global test setup
 * รันก่อน test ทุกตัว
 */

// Mock console methods (ถ้าไม่อยากเห็น console.log ตอนรัน test)
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Custom matchers (ถ้าต้องการ)
expect.extend({
  toBeValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    
    return {
      pass,
      message: () => 
        pass 
          ? `expected ${received} not to be a valid email`
          : `expected ${received} to be a valid email`
    };
  }
});