import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { PostsContext } from "../../contexts/PostContext";

const CommentItem = ({ comment, postId }) => {
  const { moderateComment, removeComment, editComment } = useContext(PostsContext);
  const [text, setText] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const handleEdit = async () =>{
    await editComment(postId, {...comment, body:text});
    setIsEdit(false);
    setText("")
  }

  const handleRemove = async () =>{
    await removeComment(postId, comment.id)
    
  }

  return (
    <Box sx={{ borderBottom: "1px solid #eee", py: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body1" fontWeight={600}>
          {comment.name} <small>({comment.email})</small>
        </Typography>
        <Box display="flex" gap={1}>
          {comment.status === "pending" && (
            <>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => moderateComment(postId, comment.id, "approve")}
              >
                Approve
              </Button>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => moderateComment(postId, comment.id, "reject")}
              >
                Reject
              </Button>
            </>
          )}
          <Chip
            label={comment.status || "pending"}
            size="small"
            sx={{ textTransform: "capitalize" }}
            color={comment.status == 'approved'? 'success' :'warning'}
          />
        </Box>
      </Box>
      {isEdit ? (
        <TextField
          label="Edit comment (max 200 chars)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          rows={2}
          sx={{ mt: 2 }}
          fullWidth
          inputProps={{ maxLength: 200 }}
        />
      ) : (
        <Typography variant="body2">{comment.body}</Typography>
      )}
      <Stack direction={"row"} mt={2} gap={1}>
        {isEdit ? (
          <>
          <Button onClick={handleEdit} variant="contained">
            Edit Comment
          </Button>
          <Button onClick={()=>{setText(""); setIsEdit(false)}} variant="contained" color="error">
            Cancel
          </Button>
          </>
        ) : (
          <>
            <IconButton
              onClick={() => {
                setText(comment.body);
                setIsEdit(true)
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleRemove}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default CommentItem;
