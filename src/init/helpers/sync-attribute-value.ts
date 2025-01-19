import type {
  Constructor,
  DecoratorMetadata,
  PropertyDecoratorMetadata,
} from '../../types';

export function syncAttributeValue(
  rootElement: HTMLElement,
  context: ClassDecoratorContext<Constructor<HTMLElement>>,
  attributeName: string
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

  // retrieve targeted property
  const property = properties.find(
    (property) => property.name === attributeName
  );

  // if property not found
  if (!property) {
    // do nothing
    return;
  }

  // recreate accessor name
  const accessor = `${property.private ? '#' : ''}${property.name}`;

  // get DOM attribute value
  const attributeValue = rootElement.getAttribute(attributeName);

  // get internal property value
  const propertyValue = (rootElement as any)?.[accessor]; // TODO: could not access private accessor

  // if different re-sync DOM attribute value with internal property
  if (attributeValue != propertyValue) {
    rootElement.setAttribute(attributeName, propertyValue);
  }
}
