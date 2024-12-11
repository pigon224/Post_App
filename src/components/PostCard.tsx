import React, { useState } from "react";
import { Card, CardContent, Typography, CardActions, Button, Collapse, Box } from "@mui/material";
import { Link } from "react-router-dom";
import PostRating from "./StarRating";

interface PostCardProps {
  id: number;
  title: string;
  content: string;
}

const PostCard: React.FC<PostCardProps> = ({ id, title, content }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleContent = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        marginBottom: 2,
        "&:hover": { boxShadow: 6 }, // Add hover effect
        transition: "0.3s", 
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {title}
        </Typography>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {content}
          </Typography>
        </Collapse>
        {!expanded && (
          <Typography variant="body2" color="text.secondary">
            {content.substring(0, 100)}...
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button size="small" onClick={toggleContent}>
          {expanded ? "Show Less" : "Read More"}
        </Button>
        <Button size="small" component={Link} to={`/post/${id}`}>
          View Details
        </Button>
      </CardActions>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", px: 2, pb: 2 }}>
        <PostRating postId={id} />
      </Box>
    </Card>
  );
};

export default PostCard;
