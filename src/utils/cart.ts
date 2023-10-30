import { useState, useEffect } from "react";
import { CartItem } from "~/models/CartItem";
import { EventHandler } from "./eventHandler";
import { Product } from "~/models/Product";
import { CartItemRec } from "~/models/Cart";
import { mapArray } from "./utils";

export type EventCallback = (items: CartItem[]) => unknown;

class Cart {
  private static _instance: Cart;
  private _cart: CartItem[] = [];
  private _products: Map<string, Product> = new Map();
  private readonly _onCartChanged: EventHandler<EventCallback>;

  private constructor() {
    this._onCartChanged = new EventHandler();
  }

  // singleton
  static get instance() {
    if (!Cart._instance) {
      Cart._instance = new Cart();
    }
    return Cart._instance;
  }

  // this is not production approach only for aws practitioner
  // all cart items should be handled by BE
  initProducts(products: Product[]) {
    this._products = mapArray(products, (i) => i.id as string);
  }

  initCart(items: CartItemRec[], invokeUpdates = true) {
    this._cart = items
      .filter((item) => this._products.has(item.productId))
      .map(({ productId, count }) => ({
        count,
        product: this._products.get(productId) as Product,
      }));
    invokeUpdates && this.invokeEvents();
  }

  on(callback: EventCallback) {
    this._onCartChanged.on(callback);
  }

  off(callback: EventCallback) {
    this._onCartChanged.off(callback);
  }

  update(item: CartItemRec) {
    const { count, productId } = item;
    if (!count) {
      return this.removeItem(productId);
    }

    let isUpdated = false;
    this._cart = this._cart.map((i) => {
      if (productId === i.product.id) {
        isUpdated = true;
        return {
          count,
          product: i.product,
        };
      }
      return i;
    });

    if (!isUpdated && this._products.has(productId)) {
      this._cart.push({
        count,
        product: this._products.get(productId) as Product,
      });
    }

    this.invokeEvents();
  }

  removeItem(productId: string) {
    this._cart = this._cart.filter((item) => item.product.id !== productId);
    this.invokeEvents();
  }

  clean() {
    this._cart = [];
    this.invokeEvents();
  }

  get items() {
    return this._cart;
  }

  private invokeEvents() {
    this._onCartChanged.invoke(this._cart);
  }
}

export const useCart = () => {
  const [items, setItems] = useState(Cart.instance.items);

  const subscriber = (cartItems: CartItem[]) => {
    setItems(cartItems);
  };

  useEffect(() => {
    Cart.instance.on(subscriber);
    return () => {
      Cart.instance.off(subscriber);
    };
  }, []);

  return { items };
};

export default Cart;
