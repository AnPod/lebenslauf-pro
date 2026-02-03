import { describe, it, expect } from 'bun:test';

describe('example unit test', () => {
  it('should add two numbers correctly', () => {
    const result = 2 + 2;
    expect(result).toBe(4);
  });

  it('should check string operations', () => {
    const text = 'Lebenslauf Pro';
    expect(text).toContain('Lebenslauf');
  });
});
