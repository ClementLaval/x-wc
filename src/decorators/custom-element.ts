import type { ClassDecoratorMetadata, Constructor } from '../types';

/**
 * Use the @customElement decorator to register your custom element.
 * Place this decorator on top of your web component class.
 * Ensure that the tag name follows the two-part format and includes a hyphen "-".
 * Refer documentation:
 * https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
 *
 * Example:
 *  - script:
 *    @customElement('my-component')
 *    class MyComponent extends HTMLElement {}
 *
 *  -html:
 *    <my-component></my-component>
 *
 * You can also create customized built-in elements by referencing the HTML type in options.
 * Make sure to specify the appropriate type when extending built-in elements.
 * Tips:
 *  - make sure to use polyfill to get Webkit support [https://unpkg.com/@ungap/custom-elements@1.3.0/min.js]
 *
 * Example:
 *  - script:
 *    @customElement('my-button', {extends: 'button'})
 *    class MyButton extends HTMLButtonElement {}
 *
 *  - html:
 *    <button is="my-button"></button>
 */
export type CustomElementDecorator = (
  // HTML tag name
  tagName: string,
  // Options (for built-in elements)
  options?: ElementDefinitionOptions
) => (
  target: CustomElementConstructor,
  context: ClassDecoratorContext<Constructor<HTMLElement>>
) => void;

export const customElement: CustomElementDecorator =
  (tagName, options) => (target, context) => {
    // Ensure customElement extending HTMLElement
    if (!(target.prototype instanceof HTMLElement)) {
      throw new Error(
        'customElement decorator can only be used on classes extending HTMLElement.'
      );
    }

    // Ensure that class is named
    if (!context.name) {
      throw new Error(
        'Class must have a name. Anonymous classes are not allowed.'
      );
    }

    // Register class metadata
    Object.assign(context.metadata, {
      [context.name]: {
        name: context.name,
        kind: context.kind,
      } satisfies ClassDecoratorMetadata,
    });
    
    // If custom element is not yet registered
    if (!customElements.get(tagName)) {
      // Define custom element globally
      customElements.define(tagName, target, options);
    }
  };
