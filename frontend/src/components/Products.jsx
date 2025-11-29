import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);

  // گرفتن لیست محصولات از سرور
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {products.map((p) => (
        <Grid item xs={12} sm={6} md={4} key={p.id}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {p.image && (
              <CardMedia
                component="img"
                height="180"
                image={p.image}
                alt={p.name}
                sx={{ objectFit: "cover" }}
              />
            )}
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {p.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  height: 60,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {p.description}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ mt: 1, fontWeight: "bold" }}
              >
                {p.price} $
              </Typography>
            </CardContent>

          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
