import React, { useContext, useEffect, useState } from "react";
import { PostsContext } from "../contexts/PostContext";
import { Box, Paper, Typography, Button, Chip, Container } from "@mui/material";

export default function ModerationPanel() {
  const { commentsCache, moderateComment } = useContext(PostsContext);
  // aggregate all pending comments
  const [pending, setPending] = useState([]);

  useEffect(() => {

    const list = [];
    for (const pid in commentsCache) {
      const items = commentsCache[pid] || [];
      for (const c of items)
        if ((c.status || "pending") === "pending" || c.status == "rejected")
          list.push({ ...c, postId: pid });
    }
    setPending(list);
  }, [commentsCache]);

  return (
    <Container maxWidth="md">
        <Paper sx={{ p: 2, mt:2 }}>
          <Typography variant="h6">Moderation Queue</Typography>
          {pending.length === 0 && <Typography>No pending comments</Typography>}
          {pending.map((c) => (
            <Box key={c.id} sx={{ borderBottom: "1px solid #eee", py: 1 }}>
              <Typography>
                {c.body}{" "}
                {c.status == "rejected" && (
                  <Chip
                    label={c.status || "pending"}
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                    color="error"
                  />
                )}
              </Typography>

              <Typography variant="caption">Post Id: {c.postId}</Typography>
              {c.status == "pending" && (
                <Box mt={1} display="flex" gap={1}>
                  <Button
                    size="small"
                    onClick={() => moderateComment(c.postId, c.id, "approve")}
                    color="success"
                    variant="contained"
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    onClick={() => moderateComment(c.postId, c.id, "reject")}
                    color="error"
                    variant="contained"
                  >
                    Reject
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </Paper>
    </Container>
  );
}
