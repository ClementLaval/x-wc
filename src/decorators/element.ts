import type { ElementDecoratorMetadata } from '../types';
import { Attribute } from '../attribute/attribute';

type NodeDefinitionOptions = {};

const defaultOptions: NodeDefinitionOptions = {};

export const element =
  <T>(options: NodeDefinitionOptions = defaultOptions) =>
  (target: Function, context: ClassMethodDecoratorContext<T>) => {
    // Ensure that element decorator is used on method
    if (!['method'].includes(context.kind)) {
      throw new Error('element decorator must be used on method only.');
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

    const originalMethod = target;

    // Inject DOM element as first argument, index as second
    target = function (el: HTMLElement, index: number, ...args: any[]) {
      return originalMethod.call(target, el as T, index, ...args);
    };

    /**
     * Register property metadata
     */
    Object.assign(context.metadata, {
      [context.name]: {
        name: attribute.name,
        kind: 'element',
      } satisfies ElementDecoratorMetadata,
    });
  };
