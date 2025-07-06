import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth";
import { handleError } from "../utils/errorhandler";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
} from "@mui/material";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await register(
        formData.fullname,
        formData.email,
        formData.password,
        formData.phone
      );

      alert(
        "Registration successful! Please check your email to verify your account."
      );

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed. Please try again.");
      handleError(err, "Signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Card style={{ backgroundColor: "#fff", padding: "20px", marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h5">Signup</Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Full Name"
            name="fullname"
            fullWidth
            margin="normal"
            value={formData.fullname}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            label="Phone"
            name="phone"
            type="tel"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Signup"}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Signup;

