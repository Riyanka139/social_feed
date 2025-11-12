import axios from "axios";

const base_url = "https://jsonplaceholder.typicode.com";

export const api = axios.create({
  baseURL: base_url,
  timeout: 10000,
});

export const attachToken = (token) => {
  api.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
};

// Posts
export const fetchPosts = () => api.get("/posts");

export const createPost = (data) => api.post("/posts", data);

export const updatePost = (id, data) =>
  api.patch(`/posts/${id}`, data);

export const deletePost = (id) =>
  api.delete(`/posts/${id}`);

// Comments
export const fetchComments = (postId) =>
  api.get("/comments", { params: { postId } });

export const createComment = (data) =>
  api.post("/comments", data);

export const updateComment = (id, data) =>
  api.patch(`/comments/${id}`, data);

export const deleteComment = (id) =>
  api.delete(`/comments/${id}`);
