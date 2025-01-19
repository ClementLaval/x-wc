import { describe, expect, test } from 'vitest';
import { customElement } from '../custom-element';
import { event } from '../event';
import { getMetadata } from '../../utils/getMetadata';

describe('event', () => {
  test('should throw error if not used on method', () => {
    // When using the decorator on a method
    expect(() => {
      @customElement('my-counter')
      class Counter extends HTMLElement {
        // @ts-ignore
        @event()
        accessor clickIncrement = '';
      }
    }).toThrowError('event decorator must be used on method only.');
  });

  test('should not throw error if  used on method', () => {
    // When using the decorator on a method
    expect(() => {
      @customElement('my-counter')
      class Counter extends HTMLElement {
        @event('click')
        clickIncrement() {}
      }
    }).not.Throw();
  });

  test('should register event metadata in the context', () => {
    // Given a custom event
    @customElement('my-counter')
    class Counter extends HTMLElement {
      @event('click')
      clickIncrement() {}
    }

    // When retrieving the custom element metadata
    const metadata = getMetadata(Counter);

    // Define the expected metadata
    const expectedMetadata = {
      Counter: {
        name: 'Counter',
        kind: 'class',
      },
      clickIncrement: {
        name: 'clickIncrement',
        kind: 'event',
        type: 'click',
      },
    };

    // Then the retrieved metadata should match the expected metadata
    expect(metadata).toEqual(expectedMetadata);
  });
});
