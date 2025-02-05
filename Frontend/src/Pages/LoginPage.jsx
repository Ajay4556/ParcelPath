import React, { useState } from "react";
import {
  Grid,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaFacebookF } from "react-icons/fa";
import { Link } from "react-router";
import { api } from "../API/api.js";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({}); // Add this line
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear the error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrors({}); // Reset field errors

    try {
      const response = await api.post("/auth/login", formData);

      // Login successful
      const data = response.data;
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.errors && Array.isArray(data.errors)) {
          const fieldErrors = {};
          data.errors.forEach((errorItem) => {
            const field = errorItem.path;
            if (fieldErrors[field]) {
              fieldErrors[field] += `, ${errorItem.msg}`;
            } else {
              fieldErrors[field] = errorItem.msg;
            }
          });
          setErrors(fieldErrors);
        } else {
          setError(data.message || "Login failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
        console.error("Error:", error);
      }
    }
  };

  return (
    <Grid container style={{ minHeight: "100vh" }}>
      <Grid
        item
        xs={12}
        md={5}
        style={{
          backgroundColor: "#FFEADA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          <img
            src="Assets/Images/logo.png"
            alt="Logo"
            style={{ height: "120px", marginRight: "16px" }}
          />
          <Typography
            variant="h4"
            fontWeight="Regular"
            color="black"
            style={{ fontFamily: "'Kaushan Script', cursive" }}
          >
            PARCELPATH
          </Typography>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        md={7}
        style={{
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTopLeftRadius: 40,
          borderBottomLeftRadius: 40,
          overflow: "hidden",
          boxShadow: "10px -1px 0px 100px #FFEADA",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <Box
          width="100%"
          maxWidth={500}
          p={4}
          bgcolor="white"
          position="relative"
          mx={2}
        >
          {/* w */}
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            color="black"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Login
          </Typography>
          <Box mb={3}>
            {/* Google and Facebook Buttons */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {/* Google Button */}
                <Button
                  variant="contained"
                  fullWidth
                  style={{
                    textTransform: "none",
                    backgroundColor: "white",
                    borderColor: "#DB4437",
                    borderWidth: 1,
                    borderStyle: "solid",
                    color: "#000000",
                    padding: "12px 0",
                  }}
                  onClick={() => {
                    window.location.href =
                      "http://localhost:5000/auth/google/signin";
                  }}
                  startIcon={
                    <img
                      src="Assets/Images/google-icon.png"
                      alt="Google"
                      style={{ width: 24, height: 24 }}
                    />
                  }
                >
                  Sign in with Google
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  fullWidth
                  style={{
                    textTransform: "none",
                    backgroundColor: "white",
                    borderColor: "#4267B2",
                    borderWidth: 1,
                    borderStyle: "solid",
                    color: "#000000",
                    padding: "12px 0",
                  }}
                  onClick={() => {
                    window.location.href =
                      "http://localhost:5000/auth/facebook/signin";
                  }}
                  startIcon={
                    <Box
                      style={{
                        backgroundColor: "#4267B2",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaFacebookF
                        style={{ color: "white", width: 14, height: 14 }}
                      />
                    </Box>
                  }
                >
                  Sign in with Facebook
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Divider>OR</Divider>
          <Box mt={3} component="form" onSubmit={handleFormSubmit}>
            <TextField
              label="E-mail Address"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleInputChange}
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Password"
              name="password"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              required
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography color="error" align="center" mt={2}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              style={{
                marginTop: 16,
                backgroundColor: "#FF6B00",
                color: "white",
                textTransform: "none",
                padding: "12px 0",
              }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
            <Typography align="center" mt={2}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "#1976d2" }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
