// src/init/observed-attributes.ts
function initObservedAttributes(target, context) {
  const properties = Object.values(
    context.metadata
  ).reduce((acc, metadata) => {
    if (metadata.kind === "property") {
      acc.push(metadata);
    }
    return acc;
  }, []);
  const observedAttributes = target.prototype.constructor.observedAttributes ?? [];
  const propertiesToObserve = properties.filter(
    (property2) => !observedAttributes.includes(property2) && !property2.private
  );
  for (const property2 of propertiesToObserve) {
    observedAttributes.push(property2.name);
  }
  Object.defineProperty(target, "observedAttributes", {
    get() {
      return observedAttributes;
    },
    configurable: true
  });
}

// src/convertors/stringToString.ts
function stringToString(value) {
  return value.toString();
}

// src/convertors/stringToNumber.ts
function stringToNumber(value) {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
}

// src/convertors/stringToBoolean.ts
function stringToBoolean(value) {
  const trueStr = "true";
  const falseStr = "false";
  if (value.toLowerCase() === trueStr) {
    return true;
  }
  if (value.toLowerCase() === falseStr) {
    return false;
  }
  if (value === "1") {
    return true;
  }
  if (value === "0") {
    return false;
  }
  return Boolean(value);
}

// src/convertors/stringToObject.ts
function stringToObject(value) {
  return JSON.parse(value);
}

// src/convertors/convert-attribute.ts
function convertAttribute(propertyValue, attributeValue) {
  if (attributeValue == null) {
    return null;
  }
  switch (typeof propertyValue) {
    case "string": {
      return stringToString(attributeValue);
    }
    case "number": {
      return stringToNumber(attributeValue);
    }
    case "boolean": {
      return stringToBoolean(attributeValue);
    }
    case "object": {
      return stringToObject(attributeValue);
    }
    default:
      throw new Error("Can not detect property type");
  }
}

// src/attribute/attribute.ts
var Attribute = class {
  // only accept string and Symbol
  constructor(input) {
    if (typeof input === "symbol") {
      this._name = input.description ?? "";
    } else if (typeof input === "string") {
      this._name = input;
    } else {
      throw new Error("Attribute name must be a string or a symbol.");
    }
    if (!this._name) {
      throw new Error("Attribute name is empty.");
    }
  }
  _name;
  // get a valid DOM attribute name
  // remove # from private property if present
  get name() {
    return this._name.replace("#", "");
  }
  // update attribute name
  set name(name) {
    this._name = name;
  }
  // does this attribute comes from private property
  isPrivate() {
    return this._name.startsWith("#");
  }
  // compute the attribute name to add to DOM to access internal properties / elements / events
  xName() {
    return `x-${this.name}`;
  }
};

// src/init/helpers/execute-elements.ts
function executeElements(rootElement, context) {
  const elements = Object.values(
    context.metadata
  ).filter((meta) => meta.kind === "element").map((element2) => element2.name);
  elements.forEach((element2) => {
    const attribute = new Attribute(element2);
    const nodeList = rootElement.querySelectorAll(`[${attribute.xName()}]`);
    const originalMethod = Object.getOwnPropertyDescriptor(
      rootElement.constructor.prototype,
      element2
    );
    nodeList.forEach((node, index) => {
      originalMethod?.value.call(rootElement, node, index);
    });
  });
}

// src/convertors/stringifyValue.ts
function stringifyValue(value) {
  switch (typeof value) {
    case "object":
      return JSON.stringify(value);
    default:
      return String(value);
  }
}

// src/init/helpers/sync-attribute-value.ts
function syncAttributeValue(rootElement, context, attributeName) {
  const properties = Object.values(
    context.metadata
  ).reduce((acc, metadata) => {
    if (metadata.kind === "property") {
      acc.push(metadata);
    }
    return acc;
  }, []);
  const property2 = properties.find(
    (property3) => property3.name === attributeName
  );
  if (!property2) {
    return;
  }
  const accessor = `${property2.private ? "#" : ""}${property2.name}`;
  const attributeValue = rootElement.getAttribute(attributeName);
  const propertyValue = rootElement?.[accessor];
  if (attributeValue != propertyValue) {
    rootElement.setAttribute(attributeName, stringifyValue(propertyValue));
  }
}

// src/init/attribute-changed-callback.ts
function initAttributeChangedCallback(target, context) {
  const properties = Object.values(
    context.metadata
  ).reduce((acc, metadata) => {
    if (metadata.kind === "property") {
      acc.push(metadata);
    }
    return acc;
  }, []);
  const existingAttributeChangedCallback = target.prototype.attributeChangedCallback ?? function(name, oldValue, newValue) {
    return true;
  };
  target.prototype.attributeChangedCallback = function(name, oldValue, newValue) {
    const result = existingAttributeChangedCallback.call(
      this,
      name,
      oldValue,
      newValue
    );
    if (result === false || result === null) {
      syncAttributeValue(this, context, name);
      return;
    }
    if (oldValue === newValue) {
      return;
    }
    const property2 = properties.find((property3) => property3.name === name);
    if (!property2) {
      return;
    }
    const accessor = `${property2.private ? "#" : ""}${property2.name}`;
    if (property2.private) {
      return;
    }
    const parsedValue = convertAttribute(this[accessor], newValue);
    Reflect.set(this, accessor, parsedValue);
    executeElements(this, context);
  };
}

// src/init/helpers/register-events.ts
function registerEvents(rootElement, context) {
  const events = Object.values(
    context.metadata
  ).filter((meta) => meta.kind === "event");
  events.forEach((event2) => {
    const attribute = new Attribute(event2.name);
    const nodeList = rootElement.querySelectorAll(`[${attribute.xName()}]`);
    const originalMethod = Object.getOwnPropertyDescriptor(
      rootElement.constructor.prototype,
      event2.name
    );
    if (!originalMethod) {
      return;
    }
    nodeList.forEach((node, index) => {
      node.addEventListener(event2.type, (e) => {
        originalMethod.value.call(rootElement, e);
      });
    });
  });
}

// src/init/connected-callback.ts
function initConnectedCallback(target, context) {
  const connectedCallback = target.prototype.connectedCallback ?? function() {
  };
  target.prototype.connectedCallback = function() {
    executeElements(this, context);
    registerEvents(this, context);
    connectedCallback.call(this);
  };
}

// src/init/helpers/remove-events.ts
function removeEvents(rootElement, context) {
  const events = Object.values(
    context.metadata
  ).filter((meta) => meta.kind === "event");
  events.forEach((event2) => {
    const attribute = new Attribute(event2.name);
    const nodeList = rootElement.querySelectorAll(`[${attribute.xName()}]`);
    const originalMethod = Object.getOwnPropertyDescriptor(
      rootElement.constructor.prototype,
      event2.name
    );
    if (!originalMethod) {
      return;
    }
    nodeList.forEach((node, index) => {
      node.removeEventListener(event2.type, (e) => {
        originalMethod.value.call(rootElement, e);
      });
    });
  });
}

// src/init/disconnected-callback.ts
function initDisconnectedCallback(target, context) {
  const disconnectedCallback = target.prototype.disconnectedCallback ?? function() {
  };
  target.prototype.disconnectedCallback = function() {
    removeEvents(this, context);
    disconnectedCallback.call(this);
  };
}

// src/init/index.ts
function initInternalDecorators(target, context) {
  initObservedAttributes(target, context);
  initAttributeChangedCallback(target, context);
  initConnectedCallback(target, context);
  initDisconnectedCallback(target, context);
}

// src/decorators/custom-element.ts
var customElement = (tagName, options) => (target, context) => {
  if (!(target.prototype instanceof HTMLElement)) {
    throw new Error(
      "customElement decorator can only be used on classes extending HTMLElement."
    );
  }
  if (!context.name) {
    throw new Error(
      "Class must have a name. Anonymous classes are not allowed."
    );
  }
  Object.assign(context.metadata, {
    [context.name]: {
      name: context.name,
      kind: "class"
    }
  });
  initInternalDecorators(target, context);
  if (!customElements.get(tagName)) {
    context.addInitializer(() => {
      customElements.define(tagName, target, options);
    });
  }
};

// src/decorators/property.ts
var defaultOptions = {};
var property = (options = defaultOptions) => (target, context) => {
  if (!["accessor"].includes(context.kind)) {
    throw new Error(
      "property decorator must be used on auto-accessors only."
    );
  }
  const attribute = new Attribute(context.name);
  Object.assign(context.metadata, {
    [attribute.name]: {
      name: attribute.name,
      kind: "property",
      private: attribute.isPrivate()
    }
  });
  return {
    init(value) {
      const initialValue = value;
      const element2 = this;
      if (context.private) {
        element2.setAttribute(attribute.name, stringifyValue(initialValue));
        return initialValue;
      }
      const attributeValue = element2.getAttribute(attribute.name);
      console.log(attributeValue);
      const parsedAttribute = convertAttribute(initialValue, attributeValue);
      if (!parsedAttribute) {
        element2.setAttribute(attribute.name, stringifyValue(initialValue));
        return initialValue;
      }
      return parsedAttribute;
    },
    get: function() {
      return target.get.call(this);
    },
    set: function(value) {
      target.set.call(this, value);
      const rootElement = this;
      rootElement.setAttribute(attribute.name, stringifyValue(value));
    }
  };
};

// src/decorators/element.ts
var defaultOptions2 = {};
var element = (options = defaultOptions2) => (target, context) => {
  if (!["method"].includes(context.kind)) {
    throw new Error("element decorator must be used on method only.");
  }
  if (!context.name) {
    throw new Error(
      "Function must have a name. Anonymous functions are not allowed."
    );
  }
  const attribute = new Attribute(context.name);
  const originalMethod = target;
  target = function(el, index, ...args) {
    return originalMethod.call(target, el, index, ...args);
  };
  Object.assign(context.metadata, {
    [context.name]: {
      name: attribute.name,
      kind: "element"
    }
  });
};

// src/decorators/event.ts
var event = (type, options = {}) => {
  return (target, context) => {
    if (!["method"].includes(context.kind)) {
      throw new Error("event decorator must be used on method only.");
    }
    if (!context.name) {
      throw new Error(
        "Function must have a name. Anonymous functions are not allowed."
      );
    }
    const attribute = new Attribute(context.name);
    if (context.name) {
      context.metadata[context.name] = {
        name: attribute.name,
        kind: "event",
        type
      };
    }
  };
};
export {
  customElement,
  element,
  event,
  property
};
