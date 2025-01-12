import type { Constructor } from '../types';
import { initObservedAttributes } from './observed-attributes';

export function initInternalDecorators(
  target: CustomElementConstructor,
  context: ClassDecoratorContext<Constructor<HTMLElement>>
): void {
  initObservedAttributes(target, context);
}
