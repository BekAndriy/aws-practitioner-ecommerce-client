import axios from "axios";
import API_PATHS from "~/constants/apiPaths";
import { Cart, CartItemRec } from "~/models/Cart";
import { CartResponse } from "./utils";
import { Order } from "~/models/Order";

export const getCartItems = async () => {
  const res = await axios.get<CartResponse<Cart>>(
    `${API_PATHS.cart}/profile/cart`,
    {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    },
  );
  return res.data.data.items;
};

export const updateCart = async (items: CartItemRec[]) => {
  const res = await axios.put<CartResponse<Cart>>(
    `${API_PATHS.cart}/profile/cart`,
    { items },
    {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    },
  );
  return res.data.data.items;
};

export const checkout = async (value: Omit<Order, "id">) => {
  const res = await axios.post<CartResponse<void>>(
    `${API_PATHS.cart}/profile/cart/checkout`,
    value,
    {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    },
  );
  return res.data.data;
};
