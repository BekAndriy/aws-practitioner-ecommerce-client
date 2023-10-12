// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventHandler<H extends (...args: any[]) => void> {
  private readonly events: Map<H, boolean>;

  constructor() {
    // key - handler
    // value - once
    this.events = new Map<H, boolean>();
  }

  on(handler: H) {
    this.events.set(handler, false);
  }

  off(handler: H) {
    this.events.delete(handler);
  }

  once(handler: H) {
    this.events.set(handler, true);
  }

  invoke(...data: Parameters<H>) {
    this.events.forEach((once, handler) => {
      // eslint-disable-next-line prefer-spread
      handler.apply(null, data);
      if (once) {
        this.events.delete(handler);
      }
    });
  }

  clear() {
    this.events.clear();
  }
}
