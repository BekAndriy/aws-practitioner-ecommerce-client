import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "~/queries/init";
import Header from "~/components/MainLayout/components/Header";
import Box from "@mui/material/Box";
import Alerts from "../Alerts/Alerts";
import Auth from "~/utils/auth";
import alertService from "~/utils/alert";
import { getProducts } from "~/queries/products";
import Cart, { EventCallback } from "~/utils/cart";
import { getCartItems, updateCart } from "~/queries/cart";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}Phone For You {new Date().getFullYear()}.
    </Typography>
  );
}

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleCartChanges: EventCallback = (cartItems) => {
    const itemsToInsert = cartItems.map((item) => ({
      productId: item.product.id as string,
      count: item.count,
    }));
    updateCart(itemsToInsert).catch(() => {
      alertService.instance.show({
        message: "Failed to update cart",
        type: "error",
      });
    });
  };

  useEffect(() => {
    // module 7 authorization
    Auth.instance.init().catch(() => null);

    // module 8 NoSQL
    // initialize card with all products
    getProducts()
      .then((res) => Cart.instance.initProducts(res.list))
      .then(() => getCartItems())
      .then((cartItems) => Cart.instance.initCart(cartItems))
      // subscribe on cart changes
      // allows to handle cart updates from any place
      // better to be implemented by Saga & Redux
      .then(() => Cart.instance.on(handleCartChanges));

    return () => {
      Cart.instance.off(handleCartChanges);
    };
  }, []);

  return (
    <>
      <main>
        <Header />
        <Container sx={{ pb: 8 }} maxWidth="md">
          {children}
        </Container>
      </main>
      <Box
        component={"footer"}
        sx={{ bgcolor: (theme) => theme.palette.background.paper, padding: 6 }}
      >
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Thank you for your purchase!
        </Typography>
        <Copyright />
        <Alerts />
      </Box>
    </>
  );
};

export default MainLayout;
