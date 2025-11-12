import { createContext, useCallback, useState } from "react";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  fetchComments,
  fetchPosts,
  updateComment,
  updatePost,
} from "../services/api";
import { getApprovedCount, setApprovedCount } from "../utills/storage";

export const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [allPost, setAllPost] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [commentsCache, setCommentsCache] = useState({});
  const [approvedCounts, setApprovedCounts] = useState(getApprovedCount());

  const loadPosts = async () => {
    const res = await fetchPosts();

    setAllPost(res.data);
    getPost({data: res.data})
  };

  // paging
  const getPost = ({data=allPost, page = 1, limit = 10, search = "", sort = "latest" } ={}) => {
    const start = (page - 1) * limit;
    let items = [...data];

    if (search) {
      items = items.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "latest") {
      items = items.sort((a, b) => b.id - a.id);
    } else if (sort === "alpha") {
      items = items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "most_commented") {
      // use cached comment counts
      items = items.sort(
        (a, b) => (approvedCounts[b.id] || 0) - (approvedCounts[a.id] || 0)
      );
    }

    items = items.slice(start, start + limit);

    setPosts((prev) => {
      const updatedPosts = page === 1 ? items : [...prev, ...items];

      if (updatedPosts.length >= allPost.length) {
        setHasMore(false);
      }

      return updatedPosts;
    });
    setPage(page);
  };

  const addPost = async ({ title, body }) => {
    try {
      const data = { title, body, userId: 1, id: allPost.length + 1 };
      await createPost(data);

      getPost({data: [data, ...allPost]});

      setAllPost((prev) => [...prev, data]);

    } catch (error) {
      console.error(error);
    }
  };

  const editPost = async (data) => {
    try {
      const res = await updatePost(data.id, data);

      setPosts((prev) =>
        prev.map((p) => (p.id === data.id ? { ...p, ...res.data } : p))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const removePost = async (id) => {
    try {
      const res = await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const loadComments = async (postId) => {
    if (commentsCache[postId]?.length) {
      return commentsCache[postId];
    }

    const res = await fetchComments(postId);
    const data = res.data.map((r) => ({ ...r, status: "approved" }));
    setCommentsCache((prev) => ({ ...prev, [postId]: data }));
    const count = data.filter(
      (comment) => comment.status === "approved"
    ).length;
    setApprovedCounts((prev) => ({ ...prev, [postId]: count }));
    return data;
  };

  const addComment = async (postId, body) => {
    try {
      const data = {
        ...body,
        id: commentsCache[postId].length + 1,
        postId,
        status: "pending",
      };
      await createComment(data);

      setCommentsCache((prev) => ({
        ...prev,
        [postId]: [...prev[postId], data],
      }));

      // getPost(page + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const editComment = async (postId, data) => {
    try {
      const res = await updateComment(data.id, data);
      const update = commentsCache[postId].map((comment) =>
        comment.id === data.id ? { ...comment, ...data } : comment
      );
      setCommentsCache((prev) => {
        return { ...prev, [postId]: update };
      });
    } catch (error) {
      console.error(error);
    }
  };

  const removeComment = async (postId, id) => {
    try {
      const res = await deleteComment(id);
      const update = commentsCache[postId].filter(
        (comment) => comment.id !== id
      );
      setCommentsCache((prev) => {
        return { ...prev, [postId]: update };
      });
      const count = update.filter(
        (comment) => comment.status === "approved"
      ).length;
      setApprovedCounts((prev) => ({ ...prev, [postId]: count }));
    } catch (error) {
      console.error(error);
    }
  };

  const moderateComment = async (postId, commentId, action) => {
    setCommentsCache((prev) => {
      const items = prev[postId].map((c) =>
        c.id === commentId
          ? { ...c, status: action === "approve" ? "approved" : "rejected" }
          : c
      );
      return { ...prev, [postId]: items };
    });

    if (action === "approve") {
      setApprovedCounts((prev) => {
        const next = { ...prev, [postId]: (prev[postId] || 0) + 1 };
        setApprovedCount(next);
        return next;
      });
    }

    try {
      await updateComment(commentId, { status: action });
      return { ok: true };
    } catch (err) {
      // rollback simple: set back to pending
      setCommentsCache((prev) => {
        const items = prev[postId].map((c) =>
          c.id === commentId ? { ...c, status: "pending" } : c
        );
        return { ...prev, [postId]: items };
      });
      if (action === "approve") {
        setApprovedCounts((prev) => {
          const next = {
            ...prev,
            [postId]: Math.max(0, (prev[postId] || 1) - 1),
          };
          setApprovedCount(next);
          return next;
        });
      }
      return { ok: false, error: err };
    }
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        loadPosts,
        getPost,
        hasMore,
        // refreshPosts,
        loadComments,
        commentsCache,
        addPost,
        editPost,
        removePost,
        addComment,
        editComment,
        removeComment,
        moderateComment,
        approvedCounts,
        // pendingOps,
        // retryPending,
        page,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
