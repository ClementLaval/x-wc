export function stringToNumber(value: string): number {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
}
