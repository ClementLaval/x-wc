import type { Constructor } from '../types';
import { executeElements } from './execute-elements';

export function initConnectedCallback(
  target: CustomElementConstructor,
  context: ClassDecoratorContext<Constructor<HTMLElement>>
): void {
  // retrieve existing connectedCallback
  const connectedCallback =
    target.prototype.connectedCallback ?? function () {};

  target.prototype.connectedCallback = function () {
    executeElements(this, context);

    // execute existing connectedCallback
    connectedCallback.call(this);
  };
}
