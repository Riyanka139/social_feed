import AddIcon from "@mui/icons-material/add";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { PostsContext } from "../../contexts/PostContext";
import CommentItem from "./CommentItem";

const CommentPanel = ({ post }) => {
  const { loadComments, addComment, commentsCache } = useContext(PostsContext);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [isAdd, setIsAdd] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadComments(post.id);
      setLoading(false);
    })();
  }, [post]);

  const comments = useMemo(() => {

    return (commentsCache[post.id] || []).filter(
      (c) => c.status !== "rejected"
    );
  }, [commentsCache]);

  async function handleAdd() {
    if (text.trim().length === 0 || text.length > 200) return;
    await addComment(post.id, {
      name: "You",
      email: "me@example.com",
      body: text,
    });
    setText("");
    setIsAdd(false)
  }
  return (
    <Paper sx={{ p: 2, mt: 1 }}>
      <Typography variant="h6">Comments</Typography>
      {loading && <Typography>Loading...</Typography>}
      {!loading && comments?.length === 0 && (
        <Typography>No comments yet</Typography>
      )}
      {comments?.map((c) => (
        <CommentItem key={c.id} comment={c} postId={post.id} />
      ))}
      {isAdd ? (
        <Box mt={2} display="grid" gap={1}>
          <TextField
            label="Add comment (max 200 chars)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            rows={2}
            inputProps={{ maxLength: 200 }}
          />
          <Box display="flex" gap={1}>
            <Button onClick={handleAdd} variant="contained">
              Add Comment
            </Button>
            <Button
              onClick={() => {setText(""); setIsAdd(false)}}
              variant="contained"
              color="error"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Button variant="contained" onClick={()=> setIsAdd(true)} sx={{mt:2}}>
            <AddIcon />
        </Button>
      )}
    </Paper>
  );
};

export default CommentPanel;
