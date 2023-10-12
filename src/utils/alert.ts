import { EventHandler } from "./eventHandler";

export interface Alert {
  type: "error" | "success";
  message: string;
  id: string;
}

type EventCallback = (alerts: Alert[]) => void;

class Alerts {
  private static _instance: Alerts;
  private _list: Alert[] = [];
  private readonly _events = new EventHandler<EventCallback>();
  private _daleyMs = 3000;

  private constructor() {
    /* */
  }

  // singleton initialization
  static get instance() {
    if (!Alerts._instance) {
      Alerts._instance = new Alerts();
    }
    return Alerts._instance;
  }

  on(callback: EventCallback) {
    this._events.on(callback);
  }

  off(callback: EventCallback) {
    this._events.off(callback);
  }

  show(alert: Omit<Alert, "id">) {
    this._list.push({
      ...alert,
      id: this.getUniqueId(),
    });
    this._events.invoke(this._list);
    this.invokeWithDaley();
  }

  close(id: string) {
    this._list = this._list.filter((item) => item.id !== id);
    this._events.invoke(this._list);
  }

  clear() {
    this._events.clear();
  }

  private invokeWithDaley() {
    setTimeout(() => {
      this._list.shift();
      this._events.invoke(this._list);
    }, this._daleyMs);
  }

  private getUniqueId() {
    return Math.random().toString(16).slice(2);
  }
}

export default Alerts;
