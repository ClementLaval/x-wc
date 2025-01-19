import { Attribute } from '../attribute/attribute';
import type { EventDecoratorMetadata } from '../types';

type EventDefinitionOptions = {};

export const event = <T, V>(
  type: Event['type'],
  options: EventDefinitionOptions = {}
) => {
  return (target: Function, context: ClassMethodDecoratorContext<T>) => {
    // Ensure that event decorator is used on method
    if (!['method'].includes(context.kind)) {
      throw new Error('event decorator must be used on method only.');
    }

    // Ensure that method is named
    if (!context.name) {
      throw new Error(
        'Function must have a name. Anonymous functions are not allowed.'
      );
    }

    /**
     * Retrieve attribute from the context
     * This attribute has the same name as the one used in the DOM
     */
    const attribute = new Attribute(context.name);

    /**
     * Add metadata
     * Used by main Class Decorator to set some behaviors
     * - Add to connectedCallback(): set eventListener on DOM elements
     * - Add to disconnectedCallback(): remove eventListener when node unmount
     */
    if (context.name) {
      context.metadata[context.name] = {
        name: attribute.name,
        kind: 'event',
        type,
      } satisfies EventDecoratorMetadata;
    }
  };
};
