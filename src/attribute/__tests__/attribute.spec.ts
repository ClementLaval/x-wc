import { describe, expect, test } from 'vitest';
import { Attribute } from '../attribute';

describe('attribute', () => {
  test('should return the same string when the attribute name is set with a string', () => {
    // Given a new attribute with a string input
    const attribute = new Attribute('count');

    // When accessing the attribute name
    // Then it should return the same string value
    expect(attribute.name).toBe('count');

    // And the attribute name should be of type string
    expect(typeof attribute.name).toBe('string');
  });

  test('should return the symbol description as string when the attribute name is set with a Symbol', () => {
    // Given a new attribute with a Symbol input
    const attribute = new Attribute(Symbol('count'));

    // When accessing the attribute name
    // Then it should return the symbol description as a string
    expect(attribute.name).toBe('count');

    // And the attribute name should be of type string
    expect(typeof attribute.name).toBe('string');
  });

  test('should throw an error if attribute name is empty', () => {
    // Given an empty string as attribute name
    const createAttributeWithEmptyName = () => new Attribute('');

    // Then it should throw an error with the message 'Attribute name is empty'
    expect(createAttributeWithEmptyName).toThrowError(
      'Attribute name is empty.'
    );
  });

  test('should throw an error if attribute is not a string or Symbol', () => {
    // Given an object as attribute name
    const createAttributeWithObjectName = () => new Attribute({} as string);

    // Then it should throw an error
    expect(createAttributeWithObjectName).toThrowError(
      'Attribute name must be a string or a symbol.'
    );
  });

  test('should return public name when attribute is #private', () => {
    // Given the attribute name is private
    const attribute = new Attribute('#count');

    // Then the attribute name should return public one (without the "#")
    expect(attribute.name).toBe('count');
  });

  test('should return true when attribute name is private', () => {
    // Given the attribute with private name
    const attribute = new Attribute('#count');

    // Then the isPrivate method should return true
    expect(attribute.isPrivate()).toBe(true);
  });

  test('should return x-attribute name', () => {
    // Given the attribute with public name
    const attribute = new Attribute('count');

    // Then should return x-named
    expect(attribute.xName()).toBe('x-count');
  });
});
