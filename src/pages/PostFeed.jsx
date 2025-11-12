import AddIcon from "@mui/icons-material/add";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostForm from "../components/posts/PostForm";
import PostItem from "../components/posts/PostItem";
import { PostsContext } from "../contexts/PostContext";
import useDebounce from "../hooks/useDebounce";

const PostFeed = () => {
  const { loadPosts, posts, getPost, hasMore, addPost, page } =
    useContext(PostsContext);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [open, setOpen] = React.useState(false);
  const debounced = useDebounce(search, 500);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await loadPosts();
        setIsLoading(false);
      } catch (error) {        
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    getPost({ page, search: debounced, sort });
  }, [debounced, sort]);

  const loadNext = useCallback(async () => {
    const next = page + 1;
    getPost({ page: next, search: debounced, sort });
  }, [page, getPost, debounced, sort]);

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            placeholder="Search posts by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="most_commented">Most Commented</MenuItem>
            <MenuItem value="alpha">Alphabetical</MenuItem>
          </Select>
          {/* <Select value={mode} onChange={(e) => setMode(e.target.value)}>
          <MenuItem value="infinite">Infinite</MenuItem>
          <MenuItem value="loadmore">Load More</MenuItem>
        </Select> */}
          <Button
            variant="contained"
            onClick={() => {
              setOpen(true);
            }}
          >
            <AddIcon />
          </Button>
        </Box>
        {isLoading && <Typography>Loading...</Typography>}

        {!isLoading && posts.length == 0 && (
          <Typography variant="h6" align="center">
            No Post Available
          </Typography>
        )}
        {posts.length > 0 && (
          <InfiniteScroll
            dataLength={posts.length}
            next={loadNext}
            hasMore={hasMore}
            loader={<Typography>Loading...</Typography>}
            endMessage={
              <Typography mb={2}>
                <b>Yay! You have seen it all</b>
              </Typography>
            }
          >
            {posts.map((p) => (
              <PostItem key={p.id} post={p} />
            ))}
          </InfiniteScroll>
        )}
      </Container>
      {open && (
        <PostForm
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          onSubmit={addPost}
        />
      )}
    </>
  );
};

export default PostFeed;
