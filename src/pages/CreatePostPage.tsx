import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Typography, Box } from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { handleSubmit, control, reset } = useForm();

  const onSubmit = async (data: any) => {
    try {
      // No need to get token from localStorage; it's managed via cookies automatically
      await api.post("/createPost", data, {
        withCredentials: true,  // This ensures cookies are sent with the request
      });
      reset();
      alert("Post created successfully!");
      navigate("/");  // Redirect to the home page after successful creation
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Post
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Title"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="content"
          control={control}
          rules={{ required: "Content is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Content"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreatePostPage;
