import type { Constructor, DecoratorMetadata, PropertyDecoratorMetadata } from '../types';
import { convertAttribute } from '../convertors/convert-attribute';
import { executeElements } from './helpers/execute-elements';
import { syncAttributeValue } from './helpers/sync-attribute-value';

/**
 * Update attributeChangedCallback:
 *  - callback called when reactive property present in observedAttributes is changed
 *  - execute existing callback first
 *  - only update none-private properties
 */
export function initAttributeChangedCallback(
  target: CustomElementConstructor,
  context: ClassDecoratorContext<Constructor<HTMLElement>>
): void {
  /**
   * Retrieve properties from metadata
   */
  const properties = Object.values(
    context.metadata as Record<string, DecoratorMetadata>
  ).reduce((acc: PropertyDecoratorMetadata[], metadata) => {
    if (metadata.kind === 'property') {
      acc.push(metadata);
    }
    return acc;
  }, []);

  // Retrieve existing attributeChangedCallback
  const existingAttributeChangedCallback =
    target.prototype.attributeChangedCallback ??
    function (name: string, oldValue: string | null, newValue: string | null) {
      return true;
    };

  target.prototype.attributeChangedCallback = function (
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    // execute the existing attributeChangedCallback code before executing lib logic
    const result = existingAttributeChangedCallback.call(
      this,
      name,
      oldValue,
      newValue
    );

    // do not execute rest if previous code break it
    if (result === false || result === null) {
      // re-sync attribute value with property if needed
      syncAttributeValue(this, context, name);
      return;
    }

    // do not execute rest if old and new values are equal (avoid infinite loop)
    if (oldValue === newValue) {
      return;
    }

    // retrieve targeted property
    const property = properties.find((property) => property.name === name);

    // if property not found
    if (!property) {
      // let unknown attribute on DOM
      return;
    }

    // recreate accessor name
    const accessor = `${property.private ? '#' : ''}${property.name}`;

    // if property is private (should never append, cause actually private property are not added to observedAttributes)
    if (property.private) {
      // TODO: find a way to re-sync DOM attribute with private property value
      // we cannot re-sync attribute with private property because we can't access it value
      return;
    }

    // parse new attribute value before set it to property
    const parsedValue = convertAttribute(this[accessor], newValue);

    // update property value
    Reflect.set(this, accessor, parsedValue);

    // execute elements
    executeElements(this, context);
  };
}
