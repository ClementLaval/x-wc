import type { Constructor } from '../types';
import { initObservedAttributes } from './observed-attributes';
import { initAttributeChangedCallback } from './attribute-changed-callback';
import { initConnectedCallback } from './connected-callback';
import { initDisconnectedCallback } from './disconnected-callback';

export function initInternalDecorators(
  target: CustomElementConstructor,
  context: ClassDecoratorContext<Constructor<HTMLElement>>
): void {
  initObservedAttributes(target, context);
  initAttributeChangedCallback(target, context);
  initConnectedCallback(target, context);
  initDisconnectedCallback(target, context);
}
