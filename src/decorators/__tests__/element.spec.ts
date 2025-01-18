import { describe, expect, test } from 'vitest';
import { customElement } from '../custom-element';
import { element } from '../element';
import { getMetadata } from '../../utils/getMetadata';
import { property } from '../property';

describe('element', () => {
  test('should throw error if not used on method', () => {
    // When using the decorator on a method
    expect(() => {
      @customElement('my-counter')
      class Counter extends HTMLElement {
        // @ts-ignore
        @element()
        accessor countText = '';
      }
    }).toThrowError('element decorator must be used on method only.');
  });

  test('should not throw error if  used on method', () => {
    // When using the decorator on a method
    expect(() => {
      @customElement('my-counter')
      class Counter extends HTMLElement {
        @element()
        countText() {}
      }
    }).not.Throw();
  });

  test('should register element metadata in the context', () => {
    // Given a custom element is defined with public 'count' property
    @customElement('my-counter')
    class Counter extends HTMLElement {
      @element()
      countText() {}
    }

    // When retrieving the custom element metadata
    const metadata = getMetadata(Counter);

    // Define the expected metadata
    const expectedMetadata = {
      Counter: {
        name: 'Counter',
        kind: 'class',
      },
      countText: {
        name: 'countText',
        kind: 'element',
      },
    };

    // Then the retrieved metadata should match the expected metadata
    expect(metadata).toEqual(expectedMetadata);
  });

  test('should execute element method on init and update DOM', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter') as Counter;
    const countTextDOM = document.createElement('div');
    countTextDOM.setAttribute('x-countText', '');
    customElementDOM.appendChild(countTextDOM);

    @customElement('my-counter')
    class Counter extends HTMLElement {
      @element()
      countText(el: HTMLElement) {
        el.textContent = '10';
      }
    }

    // Append the custom element to the document body with countText element
    document.body.appendChild(customElementDOM);

    // Then check if the custom element is correctly appended
    expect(
      document.body.contains(document.querySelector('[x-countText]'))
    ).toBe(true);
    expect(countTextDOM.textContent).toBe('10');
  });

  test('should execute element every time internal property used is changed to update DOM', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter') as Counter;
    const countTextDOM = document.createElement('div');
    countTextDOM.setAttribute('x-countText', '');
    customElementDOM.appendChild(countTextDOM);

    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor count = 0;

      @element()
      countText(el: HTMLElement) {
        el.textContent = this.count.toString();
      }

      increment() {
        this.count++;
      }
    }

    // Append the custom element to the document body with countText element
    document.body.appendChild(customElementDOM);

    // Then check if the custom element is correctly appended
    expect(customElementDOM.count).toBe(0);
    expect(countTextDOM.textContent).toBe('0');

    // When trigger another property update
    customElementDOM.increment();

    // Then element method should be executed and DOM updated with new data
    expect(customElementDOM.count).toBe(1);
    expect(countTextDOM.textContent).toBe('1');
  });
});
