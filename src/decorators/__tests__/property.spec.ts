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
        private: false,
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
        private: true,
      },
    };

    // Then the retrieved metadata should match the expected metadata
    expect(metadata).toEqual(expectedMetadata);
  });

  test('should add web component added to document body', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter') as Counter;

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
    const customElementDOM = document.createElement('my-counter') as Counter;
    customElementDOM.setAttribute('count', '32'); // initial value

    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor count = 10; // fallback value
    }

    // Append the custom element to the document body
    document.body.appendChild(customElementDOM);

    // Then check if count initial value is DOM one
    expect(customElementDOM.count).toBe(32);
    expect(typeof customElementDOM.count).toBe('number');
    // And reflected on DOM attribute
    expect(customElementDOM.getAttribute('count')).toBe('32');
  });

  test('property initial value should property fallback value if the DOM value is empty', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter') as Counter;

    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor count = 10;
    }

    // Append the custom element to the document body
    document.body.appendChild(customElementDOM);

    // Then check if count initial value is property fallback
    expect(customElementDOM.count).toBe(10);
    expect(typeof customElementDOM.count).toBe('number');
    // And reflected on DOM attribute
    expect(customElementDOM.getAttribute('count')).toBe('10');
  });

  test('property initial value should be the property value if private over DOM attribute', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter') as Counter;
    customElementDOM.setAttribute('count', '32');

    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor #count = 10; // private property

      getPrivateCount() {
        return this.#count;
      }
    }

    // Append the custom element to the document body
    document.body.appendChild(customElementDOM);

    // Then check if count initial value is private property one
    expect(customElementDOM.getPrivateCount()).toBe(10);
    expect(typeof customElementDOM.getPrivateCount()).toBe('number');
    // Then, the property should be prioritized, and the DOM attribute should be set to the same value
    expect(customElementDOM.getAttribute('count')).toBe('10');
  });

  test('accessor set function should update internal custom element + DOM attribute value', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter') as Counter;
    customElementDOM.setAttribute('count', '10');

    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor count = 0;

      increment() {
        this.count++;
      }
    }

    // Append the custom element to the document body
    document.body.appendChild(customElementDOM);

    // Update count by using increment method
    customElementDOM.increment();

    // Then new value should be reflected on DOM + property with respective types
    expect(customElementDOM.getAttribute('count')).toBe('11');
    expect(customElementDOM.count).toBe(11);
    expect(typeof customElementDOM.count).toBe('number');
  });

  test('accessor set function should update internal custom element + DOM attribute value with private', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter') as Counter;
    customElementDOM.setAttribute('count', '10');

    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor #count = 0;

      increment() {
        this.#count++;
      }

      getPrivateCount() {
        return this.#count;
      }
    }

    // Append the custom element to the document body
    document.body.appendChild(customElementDOM);

    // Update count by using increment method
    customElementDOM.increment();

    // Then new value should be reflected on DOM + property with respective types
    expect(customElementDOM.getAttribute('count')).toBe('1');
    expect(customElementDOM.getPrivateCount()).toBe(1);
    expect(typeof customElementDOM.getPrivateCount()).toBe('number');
  });
});
