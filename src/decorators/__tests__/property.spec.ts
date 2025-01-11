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

  test('should add web component added to document body', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter');

    @customElement('my-counter')
    class Counter extends HTMLElement {}

    // Append the custom element to the document body
    document.body.appendChild(customElementDOM);

    // Then check if the custom element is correctly appended
    const addedElement = document.querySelector('my-counter');
    expect(addedElement).not.toBeNull();
    expect(document.body.contains(customElementDOM)).toBe(true);
  });

  test('property initial value should be DOM value if public', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter');
    customElementDOM.setAttribute('count', '32');

    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor count = 10;
    }

    // Append the custom element to the document body
    document.body.appendChild(customElementDOM);

    // Wait for the custom element to be connected to the DOM
    const customElementWC = document.querySelector('my-counter') as Counter;
    const customElementHTML = document.querySelector(
      'my-counter'
    ) as HTMLElement;

    // Then check if count initial value is DOM one
    expect(customElementWC.count).toBe(32);
    // And reflected on DOM attribute
    expect(customElementHTML.getAttribute('count')).toBe('32');
  });

  test('property initial value should be property value if private', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter');
    customElementDOM.setAttribute('count', '32');

    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor #count = 10; // private property
    }

    // Append the custom element to the document body
    document.body.appendChild(customElementDOM);

    // Wait for the custom element to be connected to the DOM
    const customElementHTML = document.querySelector(
      'my-counter'
    ) as HTMLElement;

    // Then, the property should be prioritized, and the DOM attribute should be set to the same value
    expect(customElementHTML.getAttribute('count')).toBe('10');
  });
});
