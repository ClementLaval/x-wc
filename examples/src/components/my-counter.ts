// @ts-ignore
import { customElement, element, event, property } from '../../../dist';

@customElement('my-counter')
export class Counter extends HTMLElement {
  @property()
  accessor count = 2;

  @element()
  countEl(el: HTMLElement) {
    el.textContent = this.count.toString();

    if (this.count % 2 === 0) {
      el.style.color = 'red';
    } else {
      el.style.color = 'inherit';
    }
  }

  @event('click')
  clickIncrement(e: Event) {
    console.log(e.target);
    this.count++;
  }

  @event('mouseover')
  hoverDecrement(e: Event) {
    console.log(e.target);
    this.count--;
  }
}
