import { Box, Collapse, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import PostForm from "./PostForm";
import { PostsContext } from "../../contexts/PostContext";
import CommentPanel from "../comments/CommentPanel";

const PostItem = ({ post }) => {
  const { editPost, removePost, approvedCounts } = useContext(PostsContext);
  const [openComments, setOpenComments] = useState(false);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Box sx={{ border: "1px solid #ddd", p: 2, mb: 2, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h4">{post.title}</Typography>
            <Typography variant="body1">{post.body}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" noWrap display={"flex"} gap={1}>
              Approved:{" "}
              {approvedCounts?.[post.id] ? (
                approvedCounts[post.id] ?? 0
              ) : (
                <Skeleton width={20} />
              )}
            </Typography>
            <Stack alignItems={"end"}>
              <IconButton onClick={() => setOpen(true)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => removePost(post.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => setOpenComments((v) => !v)}>
                <CommentIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>

        {openComments && (
          <Collapse in={openComments}>
            <CommentPanel post={post} />
          </Collapse>
        )}
      </Box>
      {open && (
        <PostForm
          initial={post}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          onSubmit={editPost}
        />
      )}
    </>
  );
};

export default PostItem;
