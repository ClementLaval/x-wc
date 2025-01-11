import { describe, expect, test } from 'vitest';
import { stringToObject } from '../stringToObject';

describe('stringToObject', () => {
  test('should return same value as parsed object', () => {
    // Given string object
    const input = '{"message":"Hello World"}';

    // When convert it to object
    const result = stringToObject(input);
    const expected = {
      message: 'Hello World',
    };

    // Then should return the same value as object
    expect(result).toEqual(expected);
    expect(typeof result).toBe('object');
  });

  test('should return same value as parsed object with complex structure', () => {
    // Given string object
    const input =
      '{"message":"Something went wrong", "errors":[{"code":404, "msg":"Not Found"}]}';

    // When convert it to object
    const result = stringToObject(input);
    const expected = {
      message: 'Something went wrong',
      errors: [
        {
          code: 404,
          msg: 'Not Found',
        },
      ],
    };

    // Then should return the same value as object
    expect(result).toEqual(expected);
    expect(typeof result).toBe('object');
  });

  test('should accept array', () => {
    // Given string object
    const input = '[{"msg":"Hello World"},{"count":32}]';

    // When convert it to object
    const result = stringToObject(input);
    const expected = [
      {
        msg: 'Hello World',
      },
      {
        count: 32,
      },
    ];

    // Then should return the same value as object
    expect(result).toEqual(expected);
    expect(typeof result).toBe('object');
  });
});
