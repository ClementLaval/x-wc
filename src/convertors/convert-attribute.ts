import { stringToString } from './stringToString';
import { stringToNumber } from './stringToNumber';
import { stringToBoolean } from './stringToBoolean';
import { stringToObject } from './stringToObject';

/**
 * Convert the DOM attribute value to match the property's type as a fallback
 * ex: <my-counter count="10"><my-counter>
 *
 * @customElement('my-counter')
 * class Counter extends HTMLElement {
 *   @property()
 *   count: number = 0; // html attribute value (10) will be converted as number as fallback value is number type
 * }
 *
 */
export function convertAttribute<Value>(
  initialValue: Value,
  attribute: string | null
): Value | null {
  if (attribute == null) {
    return null;
  }

  switch (typeof initialValue) {
    case 'string': {
      return stringToString(attribute) as Value;
    }
    case 'number': {
      return stringToNumber(attribute) as Value;
    }
    case 'boolean': {
      return stringToBoolean(attribute) as Value;
    }
    case 'object': {
      return stringToObject(attribute) as Value;
    }
    default:
      throw new Error('Can not detect property type');
  }
}
