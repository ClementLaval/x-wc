import type {
  Constructor,
  DecoratorMetadata,
  PropertyDecoratorMetadata,
} from '../types';

export function initObservedAttributes(
  target: CustomElementConstructor,
  context: ClassDecoratorContext<Constructor<HTMLElement>>
): void {
  /**
   * Retrieve properties from metadata
   */
  const properties = Object.values(
    context.metadata as DecoratorMetadata[]
  ).reduce((acc: PropertyDecoratorMetadata[], metadata) => {
    if (metadata.kind === 'accessor') {
      acc.push(metadata);
    }
    return acc;
  }, []);

  /**
   * Add accessors to observedAttributes:
   *  - watch properties and enable reactivity through attributeChangedCallback()
   *  - only register none-private properties
   */
  // Retrieve existing observedAttributes or initialize an empty array
  const observedAttributes =
    target.prototype.constructor.observedAttributes ?? [];

  // Filter new attributes to observe
  // Only take missing and none-private attributes
  const propertiesToObserve = properties.filter(
    (property) => !observedAttributes.includes(property) && !property.private
  );

  // Update existing observedAttributes with new attributes
  for (const property of propertiesToObserve) {
    observedAttributes.push(property.name);
  }

  // Update the target `observedAttributes`
  Object.defineProperty(target, 'observedAttributes', {
    get() {
      return observedAttributes;
    },
    configurable: true,
  });
}
