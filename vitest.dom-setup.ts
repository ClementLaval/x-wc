import { JSDOM } from 'jsdom';
import { beforeEach } from 'vitest';

export function setupDomEnvironment() {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
  });

  // @ts-ignore
  (global as any).window = dom.window;
  (global as any).document = dom.window.document;
  (global as any).customElements = dom.window.customElements;
  (global as any).HTMLElement = dom.window.HTMLElement;
}

// Before each test, set up a fresh and clean DOM environment.
// This ensures that every custom element test runs in isolation.
beforeEach(() => {
  setupDomEnvironment();
});
