// Retrieves metadata associated with a class via a Symbol(Symbol.metadata) symbol.
export function getMetadata(target: Function): Record<string, unknown> | null {
  // Get all symbols defined on the target (class)
  const symbols = Object.getOwnPropertySymbols(target);

  // Find the symbol that represents metadata (Symbol(Symbol.metadata))
  const metadataSymbol = symbols.find(
    (symbol) => symbol.toString() === 'Symbol(Symbol.metadata)'
  );

  // If metadata symbol is found, return the associated metadata
  if (metadataSymbol) {
    // @ts-ignore
    return target[metadataSymbol]; // Return the metadata stored under the metadata symbol
  }

  // If no metadata symbol is found, return null
  return null;
}
