import { describe, it, expect, beforeEach } from 'vitest';
import { createEmailValidator } from './emailValidator';

describe('createEmailValidator', () => {
  let validator: ReturnType<typeof createEmailValidator>;

  beforeEach(() => {
    validator = createEmailValidator();
  });

  describe('valid emails', () => {
    it('should validate a standard email address', () => {
      const result = validator.safeParse({ email: 'test@example.com' });
      expect(result.success).toBe(true);
    });

    it('should validate email with subdomain', () => {
      const result = validator.safeParse({ email: 'user@mail.example.com' });
      expect(result.success).toBe(true);
    });

    it('should validate email with plus sign', () => {
      const result = validator.safeParse({ email: 'user+tag@example.com' });
      expect(result.success).toBe(true);
    });

    it('should validate email with dots in local part', () => {
      const result = validator.safeParse({ email: 'first.last@example.com' });
      expect(result.success).toBe(true);
    });

    it('should validate email with numbers', () => {
      const result = validator.safeParse({ email: 'user123@example456.com' });
      expect(result.success).toBe(true);
    });

    it('should validate email with hyphens', () => {
      const result = validator.safeParse({ email: 'user@ex-ample.com' });
      expect(result.success).toBe(true);
    });
  });

  describe('invalid emails', () => {
    it('should reject email without @', () => {
      const result = validator.safeParse({ email: 'testexample.com' });
      expect(result.success).toBe(false);
    });

    it('should reject email without domain', () => {
      const result = validator.safeParse({ email: 'test@' });
      expect(result.success).toBe(false);
    });

    it('should reject email without local part', () => {
      const result = validator.safeParse({ email: '@example.com' });
      expect(result.success).toBe(false);
    });

    it('should reject email with spaces', () => {
      const result = validator.safeParse({ email: 'test @example.com' });
      expect(result.success).toBe(false);
    });

    it('should reject empty string', () => {
      const result = validator.safeParse({ email: '' });
      expect(result.success).toBe(false);
    });

    it('should reject email with multiple @ symbols', () => {
      const result = validator.safeParse({ email: 'test@@example.com' });
      expect(result.success).toBe(false);
    });

    it('should reject email without TLD', () => {
      const result = validator.safeParse({ email: 'test@example' });
      expect(result.success).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should reject missing email field', () => {
      const result = validator.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject null email', () => {
      const result = validator.safeParse({ email: null });
      expect(result.success).toBe(false);
    });

    it('should reject undefined email', () => {
      const result = validator.safeParse({ email: undefined });
      expect(result.success).toBe(false);
    });
  });
});
