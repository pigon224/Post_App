import { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import api from "../api";  // assuming axios or your custom API handler
import PostCard from "../components/PostCard";
 // Import PostCard component

interface Post {
  id: number;
  title: string;
  content: string;
  rating: number;
}

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Fetch posts (Replace with your actual API call)
    api.get("/")
      .then((response) => {
        setPosts(response.data);  // assuming the API returns an array of posts
      })
      .catch((error) => {
        console.error("Failed to fetch posts", error);
      });
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Latest Posts
      </Typography>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            {/* Use PostCard component instead of Card */}
            <PostCard 
              id={post.id} 
              title={post.title} 
              content={post.content} 
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;
