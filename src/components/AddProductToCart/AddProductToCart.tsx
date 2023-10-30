import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Product } from "~/models/Product";
import CartIcon from "@mui/icons-material/ShoppingCart";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Cart, { useCart } from "~/utils/cart";

type AddProductToCartProps = {
  product: Product;
};

export default function AddProductToCart({ product }: AddProductToCartProps) {
  const { items } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);

  const addProduct = () => {
    let count = cartItem ? cartItem.count + 1 : 1;
    count = count > (product.count || 0) ? product.count || 0 : count;
    Cart.instance.update({
      productId: product.id as string,
      count,
    });
  };

  const removeProduct = () => {
    const count = cartItem ? cartItem.count - 1 : 0;
    Cart.instance.update({
      count: count,
      productId: product.id as string,
    });
  };

  return (
    <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
      {cartItem ? (
        <>
          <IconButton onClick={removeProduct} size="small">
            <Remove color={"secondary"} fontSize="small" />
          </IconButton>
          <Typography align="center" fontSize="small">
            {cartItem.count}
          </Typography>
          <IconButton onClick={addProduct} size="small">
            <Add color={"secondary"} fontSize="small" />
          </IconButton>
        </>
      ) : (
        <IconButton onClick={addProduct} size="small">
          <CartIcon color={"secondary"} fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}
