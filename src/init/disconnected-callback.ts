import type { Constructor } from '../types';
import { removeEvents } from './helpers/remove-events';

export function initDisconnectedCallback(
  target: CustomElementConstructor,
  context: ClassDecoratorContext<Constructor<HTMLElement>>
): void {
  // retrieve existing connectedCallback
  const disconnectedCallback =
    target.prototype.disconnectedCallback ?? function () {};

  target.prototype.disconnectedCallback = function () {
    removeEvents(this, context);

    // execute existing disconnectedCallback
    disconnectedCallback.call(this);
  };
}
