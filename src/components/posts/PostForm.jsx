import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useState } from "react";

const PostForm = ({ initial = {}, open, onClose, onSubmit }) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [body, setBody] = useState(initial?.body || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({ title, body, id:initial?.id }).then(() => {
      onClose();
      setTitle("");
      setBody("");
    });
  };

  return (
    <Dialog fullWidth={true} open={open} onClose={onClose}>
      <DialogTitle>{initial?.id ? "Edit":"Create"} Post</DialogTitle>
      <DialogContent>
        <Box
          id="post"
          component="form"
          onSubmit={handleSubmit}
          display="grid"
          gap={2}
          mt={2}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            multiline
            minRows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          type="button"
          onClick={onClose}
          variant="contained"
          color="error"
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained" form="post">
          {initial?.id ? "Update":"Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostForm;
