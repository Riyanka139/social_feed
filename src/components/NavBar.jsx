import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigate();
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ mr: 2, cursor: "pointer" }}
          onClick={() => navigation("/")}
        >
          Social Feed
        </Typography>

        {user && (
          <>
            <Box sx={{ flexGrow: 1 }}>
              <Button
                onClick={() => navigation("/panel")}
                sx={{ my: 2, color: "white" }}
              >
                Comment Moderation Panel
              </Button>
            </Box>
            <Box display="flex" gap={2} alignItems="center" flexGrow={0}>
              <Typography display={{ xs: "none", md: "block" }}>
                {user.username}
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  logout();
                  navigation("/login");
                }}
              >
                Logout
              </Button>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
