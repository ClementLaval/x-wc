type Constructor<T> = {
    new (...args: any[]): T;
};

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
type CustomElementDecorator = (tagName: string, options?: ElementDefinitionOptions) => (target: CustomElementConstructor, context: ClassDecoratorContext<Constructor<HTMLElement>>) => void;
declare const customElement: CustomElementDecorator;

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
declare const property: <This, Value>(options?: PropertyDefinitionOptions) => (target: ClassAccessorDecoratorTarget<This, Value>, context: ClassAccessorDecoratorContext<This, Value>) => ClassAccessorDecoratorResult<This, Value>;

type NodeDefinitionOptions = {};
declare const element: <T>(options?: NodeDefinitionOptions) => (target: Function, context: ClassMethodDecoratorContext<T>) => void;

type EventDefinitionOptions = {};
declare const event: <T, V>(type: Event["type"], options?: EventDefinitionOptions) => (target: Function, context: ClassMethodDecoratorContext<T>) => void;

export { customElement, element, event, property };
