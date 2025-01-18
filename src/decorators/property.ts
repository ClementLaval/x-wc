import type { PropertyDecoratorMetadata } from '../types';
import { Attribute } from '../attribute/attribute';
import { convertAttribute } from '../convertors/convert-attribute';

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

export const property =
  <This, Value>(options: PropertyDefinitionOptions = defaultOptions) =>
  (
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
        kind: 'property',
        private: attribute.isPrivate(),
      } satisfies PropertyDecoratorMetadata,
    });

    /**
     * Set new accessor definition
     */
    return {
      init(this: This, value: Value): Value {
        /**
         * Retrieve initial value passed on accessor
         * @property()
         * accessor count = 10;
         */
        const initialValue = value;
        const element = this as HTMLElement;

        /**
         * If accessor use private #variable, then html attribute value won't be used
         @property()
         accessor #count = 10;
         */
        if (context.private) {
          // Set DOM attribute with property value
          element.setAttribute(attribute.name, String(initialValue));
          return initialValue;
        }

        /**
         * Retrieve DOM custom element argument data
         * <my-counter count="10"></my-counter>
         */
        const attributeValue = element.getAttribute(attribute.name);

        /**
         * Convert attribute value into selected type
         */
        const parsedAttribute = convertAttribute(initialValue, attributeValue);

        /**
         * If DOM attribute value is falsy, return initial value from custom element's property
         * Update DOM attribute with property value
         */
        if (!parsedAttribute) {
          element.setAttribute(attribute.name, String(initialValue));
          return initialValue;
        }

        /**
         * Otherwise return the parsed DOM attribute value
         */
        return parsedAttribute;
      },
      get: function (this: This): Value {
        return target.get.call(this);
      },
      set: function (this: This, value: Value) {
        /**
         * Reflect html attribute with the new value
         * By setting html attribute, it does active web component reactivity
         * Class value are automatically updated
         */
        // Update the internal property value
        target.set.call(this, value);

        // Reflect the change in the DOM attribute
        const rootElement = this as HTMLElement;
        rootElement.setAttribute(attribute.name, String(value));
      },
    };
  };
