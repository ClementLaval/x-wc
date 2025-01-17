import { describe, expect, test } from 'vitest';
import { customElement } from '../custom-element';
import { getMetadata } from '../../utils/getMetadata';

describe('custom-element', () => {
  test('should throw error if not used on class extending HTMLElement', () => {
    // When using the decorator on a non-HTMLElement class
    expect(() => {
      // @ts-ignore
      @customElement('my-counter')
      class Counter {}
    }).toThrowError(
      'customElement decorator can only be used on classes extending HTMLElement.'
    );
  });

  test('should not throw error if used on class extending HTMLElement', () => {
    expect(() => {
      @customElement('my-counter')
      class Counter extends HTMLElement {}
    }).not.toThrow();
  });

  test('should define the custom element in the DOM', () => {
    // When defining a custom element
    @customElement('my-counter')
    class Counter extends HTMLElement {}

    // Then it should be registered in customElements
    const definedElement = customElements.get('my-counter');
    expect(definedElement).toBe(Counter);
  });

  test('should be able to define twice the same custom element without error', () => {
    expect(() => {
      @customElement('my-counter')
      class Counter extends HTMLElement {}

      @customElement('my-counter')
      class Counter2 extends HTMLElement {}
    }).not.toThrow();
  });

  test('should allow instantiation of the custom element', () => {
    // Given a custom element is defined
    @customElement('my-counter')
    class Counter extends HTMLElement {}

    // When creating an instance of the element
    const instance = document.createElement('my-counter');

    // Then it should be an instance of the defined class
    expect(instance).toBeInstanceOf(Counter);
  });

  test('should register class metadata in the context', () => {
    // Given a custom element is defined
    @customElement('my-counter')
    class Counter extends HTMLElement {}

    // When retrieving the custom element metadata
    const metadata = getMetadata(Counter);

    // Define the expected metadata
    const expectedMetadata = {
      Counter: {
        name: 'Counter',
        kind: 'class',
      },
    };

    // Then the retrieved metadata should match the expected metadata
    expect(metadata).toEqual(expectedMetadata);
  });
});
