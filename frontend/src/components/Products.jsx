import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Modal,
  Box,
} from "@mui/material";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

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

  const handleOpen = (p) => {
    setSelected(p);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <>
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

              <Button
                variant="contained"
                sx={{ m: 2, borderRadius: 2 }}
                onClick={() => handleOpen(p)}
              >
                خرید
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 3,
            width: 420,
            borderRadius: 3,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {selected && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "#f5f5f5",
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <img
                  src={selected.image}
                  alt={selected.name}
                  style={{
                    width: "160px",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" , textAlign: "center" }}>
                {selected.name}
              </Typography>
              <Button variant="contained" sx={{ borderRadius: 2, mt: 2 }}>
                افزودن به سبد خرید
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}
