import type { Constructor, DecoratorMetadata } from '../types';
import { Attribute } from '../attribute/attribute';

export function executeElements<This>(
  rootElement: HTMLElement,
  context: ClassDecoratorContext<Constructor<HTMLElement>>
): void {
  // list all elements decorator name
  const elements = Object.values(
    context.metadata as Record<string, DecoratorMetadata>
  )
    .filter((meta) => meta.kind === 'element')
    .map((element) => element.name);

  // foreach methods with element decorator
  elements.forEach((element) => {
    // retrieve each node per element using x-eventName
    const attribute = new Attribute(element);
    const nodeList = rootElement.querySelectorAll(`[${attribute.xName()}]`);

    // retrieve original method
    const originalMethod = Object.getOwnPropertyDescriptor(
      rootElement.constructor.prototype,
      element
    );

    // execute for the first time elements
    nodeList.forEach((node, index) => {
      originalMethod?.value.call(rootElement, node, index);
    });
  });
}
