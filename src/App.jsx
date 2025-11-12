import { useContext } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import { PostsProvider } from "./contexts/PostContext";
import PostFeed from "./pages/PostFeed";
import ModerationPanel from "./pages/ModerationPanel"
import { Box, Container } from "@mui/material";

const ProtectedRoute = () => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <PostsProvider>
          <AuthProvider>
            <NavBar />
            <Routes>
              <Route path="/login" element={<Login />}></Route>
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/"
                  element={
                    
                      <PostFeed />
                    
                  }
                ></Route>
                <Route path="/panel" element={<ModerationPanel/>}></Route>
                <Route path="*" element={<PostFeed />}></Route>
              </Route>
            </Routes>
          </AuthProvider>
        </PostsProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
