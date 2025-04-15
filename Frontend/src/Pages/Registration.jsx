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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaFacebookF } from "react-icons/fa";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phonenumber: "",
    city: "",
    address: "",
    role: "",
  });

  const [gLicenseFile, setGLicenseFile] = useState(null);
  const [companyRegistrationFile, setCompanyRegistrationFile] = useState(null);
  const [profileImage, setprofileImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "gLicense") {
      setGLicenseFile(files[0]);
    } else if (name === "companyRegistration") {
      setCompanyRegistrationFile(files[0]);
    } else if (name === "profileImage") {
      setprofileImage(files[0]);
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrors({});

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      if (gLicenseFile) {
        data.append("gLicense", gLicenseFile);
      }
      if (companyRegistrationFile) {
        data.append("companyRegistration", companyRegistrationFile);
      }

      const response = await fetch(`${process.env.REACT_APP_BASEURL}/auth/signup`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (result.errors && Array.isArray(result.errors)) {
          const fieldErrors = {};
          result.errors.forEach((errorItem) => {
            const field = errorItem.path || errorItem.field;
            if (fieldErrors[field]) {
              fieldErrors[field] += `, ${errorItem.msg}`;
            } else {
              fieldErrors[field] = errorItem.msg;
            }
          });
          setErrors(fieldErrors);
        } else {
          setError(result.message || "Registration failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      // Success handling
      if (result.message) {
        toast.success(result.message);
      }
      setTimeout(() => {
        window.location.href = "/login";
      }, 4000);
    } catch (error) {
      setLoading(false);
      setError("An unexpected error occurred.");
      console.error("Error:", error);
    }
  };

  return (
    <Grid container style={{ minHeight: isMdUp ? "100vh" : "auto" }}>
      <Helmet>
        <title>Register - ParcelPath</title>
        <meta
          name="description"
          content="Create a new account on ParcelPath to start managing your deliveries. Sign up as a consumer or service provider and enjoy our seamless delivery services."
        />
        <meta
          name="keywords"
          content="ParcelPath, register, sign up, delivery service, courier service, create account, consumer, service provider"
        />
        <meta property="og:title" content="Register - ParcelPath" />
        <meta
          property="og:description"
          content="Create a new account on ParcelPath to start managing your deliveries. Sign up as a consumer or service provider and enjoy our seamless delivery services."
        />
        <meta property="og:image" content="url-to-your-image" />
        <meta property="og:url" content="http://yourwebsite.com/register" />
      </Helmet>
      <Grid
        item
        xs={12}
        md={5}
        style={{
          backgroundColor: "#FFEADA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <Box display="flex" alignItems="center">
          <img
            src="Assets/Images/logo.png"
            alt="Logo"
            style={{
              height: "50px",
              marginRight: "16px",
              maxWidth: "100%",
            }}
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
          overflow: "hidden",
          fontFamily: "'Poppins', sans-serif",
          padding: 16,
          borderTopLeftRadius: isMdUp ? 40 : 0,
          borderBottomLeftRadius: isMdUp ? 40 : 0,
          boxShadow: isMdUp ? "10px -1px 0px 100px #FFEADA" : "none",
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
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            color="black"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Create Account
          </Typography>
          <Box mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
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
                      `${process.env.REACT_APP_BASEURL}/auth/google/signin`;
                  }}
                  startIcon={
                    <img
                      src="Assets/Images/google-icon.png"
                      alt="Google"
                      style={{ width: 24, height: 24 }}
                    />
                  }
                >
                  Sign up with Google
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
                      `${process.env.REACT_APP_BASEURL}/auth/facebook/signin`;
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
                  Sign up with Facebook
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Divider>OR</Divider>
          <Box mt={3} component="form" onSubmit={handleFormSubmit}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
            <TextField
              label="E-mail Address"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleInputChange}
              error={!!errors.phonenumber}
              helperText={errors.phonenumber}
            />
            <TextField
              label="City"
              variant="outlined"
              fullWidth
              margin="normal"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              error={!!errors.city}
              helperText={errors.city}
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              error={!!errors.address}
              helperText={errors.address}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              type="file"
              label="Upload Profile Picture"
              fullWidth
              margin="normal"
              name="profileImage"
              onChange={handleFileChange}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Select Role</FormLabel>
              <RadioGroup
                row
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="consumer"
                  control={<Radio />}
                  label="Consumer"
                />
                <FormControlLabel
                  value="service provider"
                  control={<Radio />}
                  label="Service Provider"
                />
              </RadioGroup>
              {errors.role && (
                <Typography color="error" variant="body2">
                  {errors.role}
                </Typography>
              )}
            </FormControl>

            {formData.role === "service provider" && (
              <>
                <TextField
                  type="file"
                  label="Upload G License"
                  fullWidth
                  margin="normal"
                  name="gLicense"
                  onChange={handleFileChange}
                  error={!!errors.gLicense}
                  helperText={errors.gLicense}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  type="file"
                  label="Upload Company Registeration Document"
                  fullWidth
                  margin="normal"
                  name="companyRegistration"
                  onChange={handleFileChange}
                  error={!!errors.companyRegistration}
                  helperText={errors.companyRegistration}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </>
            )}

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
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
            <Typography align="center" mt={2}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#1976d2" }}>
                Log In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Registration;
