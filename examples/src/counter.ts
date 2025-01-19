import { customElement, element, property } from 'x-wc';

@customElement('my-counter')
export class Counter extends HTMLElement {
  @property()
  accessor count = 2;

  @element({
    init: () => {},
  })
  countEl(el: HTMLElement) {
    el.textContent = this.count.toString();
  }

  increment() {
    this.count++;
  }

  connectedCallback() {
    console.log('toto');
    this.increment();
  }
}
