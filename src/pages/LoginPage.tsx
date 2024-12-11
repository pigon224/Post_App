import api from "../api";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage = () => {
  const { handleSubmit, control } = useForm<LoginFormData>();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);
      console.log("dsfsdfsdfdsfsdf",formData)

      // Login request
      await api.post("/login", formData, {
        
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      } );
    
      

      // Set the user in context
      setUser({ username: data.username });

      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: "400px" }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Username is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Username"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Log In
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
