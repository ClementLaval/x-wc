export type Constructor<T> = {
  new (...args: any[]): T;
};

export type DecoratorMetadata =
  | ClassDecoratorMetadata
  | PropertyDecoratorMetadata
  | EventDecoratorMetadata;

export type ClassDecoratorMetadata = {
  name: string;
  kind: 'class';
};

export type PropertyDecoratorMetadata = {
  name: string;
  kind: 'accessor';
  private: boolean;
};

export type EventDecoratorMetadata = {
  name: string;
  kind: 'method';
  type: Event['type'];
};
