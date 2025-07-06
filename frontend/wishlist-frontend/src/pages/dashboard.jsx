import React, { useEffect, useState } from "react";
import api from "../utils/api";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Box,
  Button,
  TextField,
  Stack,
} from "@mui/material";

const Dashboard = () => {
  const [wishlists, setWishlists] = useState([]);
  const [newWishlist, setNewWishlist] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [createError, setCreateError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const response = await api.get("/wishlist");
      setWishlists(response.data);
    } catch (err) {
      console.error("Failed to fetch wishlists", err);
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWishlist = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);

    if (!newWishlist.trim()) {
      setCreateError("Wishlist name cannot be empty.");
      setCreating(false);
      return;
    }

    try {
      await api.post("/wishlist", { name: newWishlist });
      setNewWishlist("");
      fetchWishlists();
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create wishlist", err);
      setCreateError(err.response?.data?.msg || "Failed to create wishlist");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteWishlist = async (id) => {
  if (!window.confirm("Are you sure you want to delete this wishlist?")) return;

  console.log("🗑 Attempting to delete wishlist with ID:", id);
  setDeletingId(id);

  try {
    const response = await api.delete(`/wishlist/${id}`);
    console.log("✅ Deletion response:", response);

    setWishlists((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      console.log("📦 Updated wishlists after deletion:", updated);
      return updated;
    });
  } catch (err) {
    console.error("❌ Failed to delete wishlist:", err);
    if (err.response) {
      console.error("🛑 Server responded with:", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("📡 No response received from server:", err.request);
    } else {
      console.error("⚠️ Error setting up request:", err.message);
    }
    alert("Failed to delete wishlist");
  } finally {
    console.log("🔁 Resetting deletingId");
    setDeletingId(null);
  }
};


  useEffect(() => {
    fetchWishlists();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Wishlists
      </Typography>

      {!showForm && (
        <Button variant="contained" sx={{ mb: 3 }} onClick={() => setShowForm(true)}>
          + Create Wishlist
        </Button>
      )}

      {showForm && (
        <Box component="form" onSubmit={handleCreateWishlist} sx={{ mb: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="New Wishlist Name"
              value={newWishlist}
              onChange={(e) => setNewWishlist(e.target.value)}
              disabled={creating}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={creating}
            >
              {creating ? <CircularProgress size={24} /> : "Create"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setShowForm(false);
                setNewWishlist("");
              }}
            >
              Cancel
            </Button>
          </Stack>
          {createError && <Alert severity="error" sx={{ mt: 2 }}>{createError}</Alert>}
        </Box>
      )}

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && wishlists.length === 0 && (
        <Alert severity="info">You have no wishlists. Start by creating one!</Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "flex-start",
          mt: 4,
        }}
      >
        {wishlists.map((wishlist) => (
          <Card key={wishlist.id} variant="outlined" sx={{ width: 275 }}>
            <CardContent>
              <Typography variant="h6">{wishlist.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                Created by you
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  href={`/wishlist/${wishlist.id}`}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteWishlist(wishlist.id)}
                  disabled={deletingId === wishlist.id}
                >
                  {deletingId === wishlist.id ? "Deleting..." : "Delete"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Dashboard;




