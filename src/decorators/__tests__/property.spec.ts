import { describe, expect, test } from 'vitest';
import { customElement } from '../custom-element';
import { property } from '../property';
import { getMetadata } from '../../utils/getMetadata';

describe('property', () => {
  test('should throw error if not used on auto accessor', () => {
    // When using the decorator on a non-auto accessor
    expect(() => {
      @customElement('my-counter')
      class Counter extends HTMLElement {
        // @ts-ignore
        @property()
        count = 0;
      }
    }).toThrowError('property decorator must be used on auto-accessors only.');
  });

  test('should not throw error if used on auto accessor', () => {
    // When using the decorator on a non-auto accessor
    expect(() => {
      @customElement('my-counter')
      class Counter extends HTMLElement {
        @property()
        accessor count = 0;
      }
    }).not.Throw();
  });

  test('should register property metadata in the context with public attribute name', () => {
    // Given a custom element is defined with public 'count' property
    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor count = 0;
    }

    // When retrieving the custom element metadata
    const metadata = getMetadata(Counter);

    // Define the expected metadata
    const expectedMetadata = {
      Counter: {
        kind: 'class',
        name: 'Counter',
      },
      count: {
        name: 'count',
        kind: 'accessor',
      },
    };

    // Then the retrieved metadata should match the expected metadata
    expect(metadata).toEqual(expectedMetadata);
  });

  test('should register property metadata in the context with private attribute name', () => {
    // Given a custom element is defined with private 'count' property
    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor #count = 0;
    }

    // When retrieving the custom element metadata
    const metadata = getMetadata(Counter);

    // Define the expected metadata
    const expectedMetadata = {
      Counter: {
        kind: 'class',
        name: 'Counter',
      },
      count: {
        name: 'count',
        kind: 'accessor',
      },
    };

    // Then the retrieved metadata should match the expected metadata
    expect(metadata).toEqual(expectedMetadata);
  });
});
