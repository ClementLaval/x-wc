export function stringifyValue(value: unknown): string {
  switch (typeof value) {
    case 'object':
      return JSON.stringify(value);

    default:
      return String(value);
  }
}
