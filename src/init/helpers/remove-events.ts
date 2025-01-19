import type { Constructor, DecoratorMetadata } from '../../types';
import { Attribute } from '../../attribute/attribute';

export function removeEvents(
  rootElement: HTMLElement,
  context: ClassDecoratorContext<Constructor<HTMLElement>>
): void {
  // List all events decorator from metadata
  const events = Object.values(
    context.metadata as Record<string, DecoratorMetadata>
  ).filter((meta) => meta.kind === 'event');

  // Foreach event
  events.forEach((event) => {
    // retrieve each node per element using x-eventName
    const attribute = new Attribute(event.name);
    const nodeList = rootElement.querySelectorAll(`[${attribute.xName()}]`);

    // retrieve original method
    const originalMethod = Object.getOwnPropertyDescriptor(
      rootElement.constructor.prototype,
      event.name
    );

    // if original method not found
    if (!originalMethod) {
      return;
    }

    // remove event listener on each node of the list
    nodeList.forEach((node, index) => {
      node.removeEventListener(event.type, (e) => {
        originalMethod.value.call(rootElement, e);
      });
    });
  });
}
