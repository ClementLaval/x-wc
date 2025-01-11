export function stringToBoolean(value: string): boolean {
  const trueStr = 'true';
  const falseStr = 'false';

  if (value.toLowerCase() === trueStr) {
    return true;
  }
  
  if (value.toLowerCase() === falseStr) {
    return false;
  }

  if (value === '1') {
    return true;
  }

  if (value === '0') {
    return false;
  }

  return Boolean(value);
}
