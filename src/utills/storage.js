const TOKEN_KEY = "token_v1";
const APPROVED_COUNTS_KEY = "approved_counts_v1";

export const setToken = (value) => {
  if (value) {
    localStorage.setItem(TOKEN_KEY, value);
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getApprovedCount = () => {
  const raw = localStorage.getItem(APPROVED_COUNTS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export const setApprovedCount = (obj) => {
  localStorage.setItem(APPROVED_COUNTS_KEY, JSON.stringify(obj));
}
