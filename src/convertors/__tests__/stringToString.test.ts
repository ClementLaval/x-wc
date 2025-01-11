import { describe, expect, test } from 'vitest';
import { stringToString } from '../stringToString';

describe('stringToString', () => {
  test('should return same value as string', () => {
    // Given string input
    const input = 'Hello World!';

    // When convert it to string
    const result = stringToString(input);

    // Then should return the same value as string
    expect(result).toBe(input);
    expect(typeof result).toBe('string');
  });
});
