import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";

const WishlistDetail = () => {
  const { id } = useParams(); // wishlist ID
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    imageUrl: "",
    price: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [inviteEmail, setInviteEmail] = useState("");
const [inviteMessage, setInviteMessage] = useState("");


  const fetchProducts = async () => {
    try {
      const res = await api.get(`/product/${id}`);
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id]);

  const handleAddProduct = async () => {
    try {
      await api.post("/product", {
        ...newProduct,
        wishlistId: id,
      });
      setNewProduct({ name: "", imageUrl: "", price: "" });
      fetchProducts();
    } catch (err) {
      alert("Failed to add product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/product/${productId}`);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };
  const handleInvite = async () => {
  try {
    const res = await api.post(`/wishlist/invite/${id}`, { email: inviteEmail });
    setInviteMessage(res.data.msg);
    setInviteEmail("");
  } catch (err) {
    setInviteMessage("Failed to invite user");
  }
};


  const handleEditProduct = async (productId) => {
    try {
      await api.put(`/product/${productId}`, editedProduct);
      setEditingId(null);
      setEditedProduct({});
      fetchProducts();
    } catch (err) {
      alert("Failed to update product");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Wishlist Products
      </Typography>

      {/* Add Product */}
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TextField
            label="Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Image URL"
            value={newProduct.imageUrl}
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageUrl: e.target.value })
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Price"
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <Button variant="contained" onClick={handleAddProduct} fullWidth>
            Add Product
          </Button>
        </Grid>
      </Grid>
      <Box mt={4}>
  <Typography variant="h6" gutterBottom>Invite User to Wishlist</Typography>
  <Grid container spacing={2}>
    <Grid item xs={8} sm={6}>
      <TextField
        label="User Email"
        value={inviteEmail}
        onChange={(e) => setInviteEmail(e.target.value)}
        fullWidth
      />
    </Grid>
    <Grid item xs={4} sm={3}>
      <Button variant="contained" onClick={handleInvite} fullWidth>
        Invite
      </Button>
    </Grid>
  </Grid>

  {inviteMessage && (
    <Box mt={2}>
      <Alert severity={inviteMessage.includes("Failed") ? "error" : "success"}>
        {inviteMessage}
      </Alert>
    </Box>
  )}
</Box>


      {/* Product List */}
      <Box mt={4}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card>
                  <CardContent>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    {editingId === product.id ? (
                      <>
                        <TextField
                          label="Name"
                          value={editedProduct.name || ""}
                          onChange={(e) =>
                            setEditedProduct((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          fullWidth
                          sx={{ mt: 1 }}
                        />
                        <TextField
                          label="Image URL"
                          value={editedProduct.imageUrl || ""}
                          onChange={(e) =>
                            setEditedProduct((prev) => ({
                              ...prev,
                              imageUrl: e.target.value,
                            }))
                          }
                          fullWidth
                          sx={{ mt: 1 }}
                        />
                        <TextField
                          label="Price"
                          type="number"
                          value={editedProduct.price || ""}
                          onChange={(e) =>
                            setEditedProduct((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                          fullWidth
                          sx={{ mt: 1 }}
                        />
                        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                          <Button
                            variant="contained"
                            onClick={() => handleEditProduct(product.id)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </>
                    ) : (
                      <>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography variant="body2">
                          ₹ {product.price}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setEditingId(product.id);
                              setEditedProduct({
                                name: product.name,
                                imageUrl: product.imageUrl,
                                price: product.price,
                              });
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            color="error"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
    </Box>
  );
};

export default WishlistDetail;
