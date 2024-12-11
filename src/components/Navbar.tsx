import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import api from "../api"; // Your Axios instance

const Navbar = () => {
  const { user, setUser } = useUser(); // Access user context
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout endpoint
      await api.post("/logout");
      setUser(null); // Clear user context
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Post Factory
        </Typography>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/my-posts">
              My Posts
            </Button>
            <Button color="inherit" component={Link} to="/create-post">
              Add Post
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
