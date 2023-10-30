import { CartItem } from "./CartItem";

export interface CartItemRec extends Pick<CartItem, "count"> {
  productId: string;
}

export interface Cart {
  cartId: string;
  items: CartItemRec[];
}
