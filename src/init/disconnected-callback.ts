import type { Constructor } from '../types';
import { executeElements } from './execute-elements';

export function initDisconnectedCallback(
  target: CustomElementConstructor,
  context: ClassDecoratorContext<Constructor<HTMLElement>>
): void {
  // retrieve existing connectedCallback
  const disconnectedCallback =
    target.prototype.disconnectedCallback ?? function () {};

  target.prototype.disconnectedCallback = function () {
    executeElements(this, context);

    // execute existing disconnectedCallback
    disconnectedCallback.call(this);
  };
}
