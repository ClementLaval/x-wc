export class Attribute {
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

  get name(): string {
    return this._name.replace('#', '');
  }

  set name(name: string) {
    this._name = name;
  }

  isPrivate(): boolean {
    return this._name.startsWith('#');
  }

  xName(): string {
    return `x-${this.name}`;
  }
}
