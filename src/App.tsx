import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import MyPosts from "./pages/MyPostsPage";
import CreatePost from "./pages/CreatePostPage";
import { Container, Box } from "@mui/material";
import { UserContextProvider  } from "./context/UserContext";
import Signup from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

const App: React.FC = () => {
  return (
    <UserContextProvider >
      <Router>
        <Navbar />
        <Container maxWidth="lg">
          <Box sx={{ paddingTop: 4 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/my-posts" element={<MyPosts />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Box>
        </Container>
      </Router>
    </UserContextProvider >
  );
};

export default App;
