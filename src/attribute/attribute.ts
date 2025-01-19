export class Attribute {
  // only accept string and Symbol
  constructor(input: string | Symbol) {
    if (typeof input === 'symbol') {
      this._name = input.description ?? '';
    } else if (typeof input === 'string') {
      this._name = input;
    } else {
      throw new Error('Attribute name must be a string or a symbol.');
    }

    if (!this._name) {
      throw new Error('Attribute name is empty.');
    }
  }

  private _name: string;

  // get a valid DOM attribute name
  // remove # from private property if present
  get name(): string {
    return this._name.replace('#', '');
  }

  // update attribute name
  set name(name: string) {
    this._name = name;
  }

  // does this attribute comes from private property
  isPrivate(): boolean {
    return this._name.startsWith('#');
  }

  // compute the attribute name to add to DOM to access internal properties / elements / events
  xName(): string {
    return `x-${this.name}`;
  }
}
