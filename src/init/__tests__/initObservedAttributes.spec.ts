import { describe, expect, test } from 'vitest';
import { customElement } from '../../decorators/custom-element';
import { property } from '../../decorators/property';

describe('intObservedAttributes', () => {
  test('should set only none-private properties', () => {
    // Given a web component on DOM
    const customElementDOM = document.createElement('my-counter') as Counter;

    @customElement('my-counter')
    class Counter extends HTMLElement {
      @property()
      accessor title = 'My Counter';
      @property()
      accessor count = 0;
      @property()
      accessor #count2 = 20;

      static get observedAttributes() {
        return []; // declared empty
      }
    }

    // Append the custom element to the document body
    document.body.appendChild(customElementDOM);

    const expectedAttributes = ['title', 'count'];

    // Then custom element's observed attributes should be none-private properties
    expect(Counter.observedAttributes).toEqual(expectedAttributes);
  });
});
