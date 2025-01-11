import { describe, expect, test } from 'vitest';
import { stringToBoolean } from '../stringToBoolean';

describe('stringToBoolean', () => {
  test('should return same value as boolean', () => {
    // Given string boolean
    const input = 'true';

    // When convert it to boolean
    const result = stringToBoolean(input);
    const expected = true;

    // Then should return the same value as boolean
    expect(result).toBe(expected);
    expect(typeof result).toBe('boolean');
  });

  test('should return same value as boolean', () => {
    // Given string boolean
    const input = 'false';

    // When convert it to boolean
    const result = stringToBoolean(input);
    const expected = false;

    // Then should return the same value as boolean
    expect(result).toBe(expected);
    expect(typeof result).toBe('boolean');
  });

  test('should accept 0 and 1', () => {
    // Given string boolean
    const input = '0';

    // When convert it to boolean
    const result = stringToBoolean(input);
    const expected = false;

    // Then should return the same value as boolean
    expect(result).toBe(expected);
    expect(typeof result).toBe('boolean');
  });

  test('should accept 0 and 1', () => {
    // Given string boolean
    const input = '1';

    // When convert it to boolean
    const result = stringToBoolean(input);
    const expected = true;

    // Then should return the same value as boolean
    expect(result).toBe(expected);
    expect(typeof result).toBe('boolean');
  });

  test('should parse as Boolean for others types', () => {
    // Given string
    const input = 'random string';

    // When convert it to boolean
    const result = stringToBoolean(input);
    const expected = true;

    // Then should return the same value as boolean
    expect(result).toBe(expected);
    expect(typeof result).toBe('boolean');
  });

  test('should parse as Boolean for others types', () => {
    // Given string
    const input = '';

    // When convert it to boolean
    const result = stringToBoolean(input);
    const expected = false;

    // Then should return the same value as boolean
    expect(result).toBe(expected);
    expect(typeof result).toBe('boolean');
  });
});
