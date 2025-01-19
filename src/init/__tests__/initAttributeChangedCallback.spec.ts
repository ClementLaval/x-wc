import { describe, expect, test } from 'vitest';
import { customElement } from '../../decorators/custom-element';
import { property } from '../../decorators/property';

describe('initAttributeChangedCallback', () => {
  test('DOM attribute change should update public property', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter') as Counter;
    customElementDOM.setAttribute('count', '10');

    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor count = 0;
    }

    // Append the custom element to the document body
    document.body.appendChild(customElementDOM);

    // When changing attribute DOM value
    customElementDOM.setAttribute('count', '12');

    // Then property should be updated with same parsed value
    expect(customElementDOM.count).toBe(12);
    expect(typeof customElementDOM.count).toBe('number');
  });

  test('previous attributeChangedCallback code should be executed before lib callback', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter') as Counter;
    customElementDOM.setAttribute('count', '10');

    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor count = 0;

      attributeChangedCallback() {
        return false;

        // ... lib callback execution
      }
    }

    // Append the custom element to the document body
    document.body.appendChild(customElementDOM);

    // When changing attribute DOM value
    customElementDOM.setAttribute('count', '12');

    // The property should remain unaffected and not be updated by DOM changes.
    expect(customElementDOM.count).toBe(10);
    expect(typeof customElementDOM.count).toBe('number');

    // Then DOM attribute re-sync with property
    expect(customElementDOM.getAttribute('count')).toBe('10');
  });

  test('DOM attribute change should not update private property', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter') as Counter;

    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor #count = 0;

      getPrivateCount() {
        return this.#count;
      }
    }

    // Append the custom element to the document body
    document.body.appendChild(customElementDOM);

    // When changing attribute DOM value
    customElementDOM.setAttribute('count', '2');

    // Then property should not be updated
    expect(customElementDOM.getPrivateCount()).toBe(0);
    expect(typeof customElementDOM.getPrivateCount()).toBe('number');

    // Then DOM attribute is not re-sync with property
    expect(customElementDOM.getAttribute('count')).toBe('2');
  });
});
