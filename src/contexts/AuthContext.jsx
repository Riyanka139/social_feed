import { createContext, useState } from "react";
import { attachToken } from "../services/api";
import { getToken, removeToken, setToken } from "../utills/storage";

export const AuthContext = createContext();

const mockUser = {
  username: "testuser@logicwind.com",
  password: "Test123!",
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getToken());
  const [user, setUser] = useState(
    auth ? { username: mockUser.username } : null
  );

  const login = ({ username, password }) => {
    return new Promise((resolve, reject) => {
      if (username === mockUser.username && password === mockUser.password) {
        const t = "mocked-access-token-123456";
        setAuth(t);
        setToken(t);
        setUser({ username });
        attachToken(t)
        resolve({ success: true, user: { username } });
      }
      reject({ success: false, message: "Invalid credentials" });
    });
  };

  const logout = () => {
    localStorage.clear()
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token:auth, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
