import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { formatAsPrice } from "~/utils/utils";
import AddProductToCart from "~/components/AddProductToCart/AddProductToCart";
import { useAvailableProducts } from "~/queries/products";
import css from "./Products.module.scss";

export default function Products() {
  const { data, isLoading } = useAvailableProducts();

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  const { list = [] } = data || {};

  return (
    <Box component="div" sx={{ paddingTop: "50px" }}>
      <Typography
        variant="h1"
        sx={{ paddingBottom: "30px", fontSize: "36px", fontWeight: "bold" }}
      >
        Choose Your Phone
      </Typography>
      <Grid container spacing={4}>
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
        {list.map((product, index) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                sx={{ pt: "133.3%" }}
                image={`https://source.unsplash.com/random?sig=${index}`}
                title="Image title"
              />
              <CardContent sx={{}}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.title}
                </Typography>
                <div className={css.bottomAction}>
                  <Typography>{formatAsPrice(product.price)}</Typography>
                  <AddProductToCart product={product} />
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
