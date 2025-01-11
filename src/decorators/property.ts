import type { PropertyDecoratorMetadata } from '../types';
import { Attribute } from '../attribute/attribute';

/**
 * Use @property() decorator on a custom element variable to bind
 * it with the DOM, and automatically track updated.
 *
 * What @property() does:
 *  - Add argument within custom element constructor and html tag
 *  - Add property to current HTML tag
 *  - Convert in/out data, depending on options.type
 *  - Create getter/setter to be sync with html attribute
 *  - Add attribute name to static observedAttributes
 *  - Attach a tracker on DOM elements who access it with 'x-propertyName'
 *
 *  Doc: https://www.youtube.com/watch?v=1hq_tNPWASM&t
 */
type PropertyDefinitionOptions = {};

const defaultOptions: PropertyDefinitionOptions = {};

export const property = <This, Value>(
  options: PropertyDefinitionOptions = defaultOptions
) => {
  return (
    target: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value>
  ): ClassAccessorDecoratorResult<This, Value> => {
    // Ensure that property decorator is used on class accessor
    if (!['accessor'].includes(context.kind)) {
      throw new Error(
        'property decorator must be used on auto-accessors only.'
      );
    }

    /**
     * Retrieve attribute from the context
     * This attribute has the same name as the one used in the DOM
     */
    const attribute = new Attribute(context.name);

    /**
     * Register property metadata
     * Used by main Class Decorator to set some behaviors
     * - Add to observedAttributes: enable reactivity
     * - Add to attributeChangedCallback(): track updates and change DOM
     */
    Object.assign(context.metadata, {
      [attribute.name]: {
        name: attribute.name,
        kind: context.kind,
      } satisfies PropertyDecoratorMetadata,
    });

    return {};
  };
};
