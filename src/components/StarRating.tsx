import React, { useState, useEffect } from "react";
import { Rating, Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import api from "../api"; // Ensure your Axios instance is set up correctly

interface PostRatingProps {
  postId: number;
}

const labels: { [index: string]: string } = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const PostRating: React.FC<PostRatingProps> = ({ postId }) => {
  const [rating, setRating] = useState<number | null>(null); // Current rating state
  const [hover, setHover] = useState(-1); // Hover state
  const [error, setError] = useState<string>("");

  // Fetch the initial rating for the post from the backend
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await api.get(`/rate/${postId}`);
        setRating(response.data.rating); // Assuming the API returns a 'rating' field
      } catch (err) {
        console.error("Failed to fetch rating", err);
      }
    };
    fetchRating();
  }, [postId]);

  const handleRatingChange = async (_event: any, newValue: React.SetStateAction<number | null>) => {
    if (newValue === null) return;
  
    // Optimistically update the rating in the UI
    setRating(newValue);
  
    try {
      await api.post(`/rate/${postId}`, { rating: newValue }, {
        withCredentials: true, // Ensures cookies are sent with the request
      });
      console.log(`Rating for post ${postId} updated to ${newValue}`);
    } catch (err) {
      setError("Failed to submit rating. Please try again.");
      console.error(err);
    }
  };


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
        p: 2,
        border: "1px solid #ddd",
        borderRadius: "8px",
        width: "100%",
        maxWidth: "400px",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Rate this post:
      </Typography>

      {/* MUI Rating Component with hover feedback */}
      <Rating
        name={`rating-post-${postId}`}
        value={rating}
        onChange={handleRatingChange}
        precision={0.5}
        size="large"
        onChangeActive={(_event, newHover) => setHover(newHover)}
        getLabelText={getLabelText}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        sx={{ cursor: "pointer" }}
      />

      {/* Display the label text */}
      {rating !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : rating]}</Box>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default PostRating;
