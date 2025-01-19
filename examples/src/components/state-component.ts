// @ts-ignore
import { customElement, element, event, property } from '../../../dist';

type State = {
  msg: string;
  count: number;
};

@customElement('state-component')
export class StateComponent extends HTMLElement {
  @property()
  accessor state: State = { msg: '', count: 0 };

  @element()
  stateCount(el: HTMLElement) {
    el.textContent = this.state.count.toString();
  }

  @element()
  stateMsg(el: HTMLInputElement) {
    el.value = this.state.msg.toString();
  }

  @element()
  stateJson(el: HTMLElement) {
    el.textContent = JSON.stringify(this.state);
  }

  @event('click')
  clickIncrement() {
    this.state = {
      ...this.state,
      count: this.state.count + 1,
    };
  }

  @event('input')
  onMsgInput(e: InputEvent) {
    const target = e.target as HTMLInputElement;
    this.state = {
      ...this.state,
      msg: target.value,
    };
  }
}
