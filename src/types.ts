export type Constructor<T> = {
  new (...args: any[]): T;
};

export type DecoratorMetadata =
  | ClassDecoratorMetadata
  | PropertyDecoratorMetadata
  | ElementDecoratorMetadata
  | EventDecoratorMetadata;

export type ClassDecoratorMetadata = {
  name: string;
  kind: 'class';
};

export type PropertyDecoratorMetadata = {
  name: string;
  kind: 'property';
  private: boolean;
};

export type ElementDecoratorMetadata = {
  name: string;
  kind: 'element';
};

export type EventDecoratorMetadata = {
  name: string;
  kind: 'event';
  type: Event['type'];
};
