import { describe, expect, test } from 'vitest';
import { stringToNumber } from '../stringToNumber';

describe('stringToNumber', () => {
  test('should return same value as number with integer', () => {
    // Given string integer
    const input = '12';

    // When convert it to number
    const result = stringToNumber(input);
    const expected = 12;

    // Then should return the same value as number
    expect(result).toBe(expected);
    expect(typeof result).toBe('number');
  });

  test('should return same value as number with float', () => {
    // Given string float
    const input = '12.42';

    // When convert it to number
    const result = stringToNumber(input);
    const expected = 12.42;

    // Then should return the same value as number
    expect(result).toBe(expected);
    expect(typeof result).toBe('number');
  });

  test('should return same value as number with negative value', () => {
    // Given string negative number
    const input = '-38';

    // When convert it to number
    const result = stringToNumber(input);
    const expected = -38;

    // Then should return the same value as number
    expect(result).toBe(expected);
    expect(typeof result).toBe('number');
  });

  test('should return 0 when input is NaN', () => {
    // Given string incorrect number
    const input = '38f';

    // When convert it to number
    const result = stringToNumber(input);
    const expected = 0;

    // Then should return the same value as number
    expect(result).toBe(expected);
    expect(typeof result).toBe('number');
  });
});
