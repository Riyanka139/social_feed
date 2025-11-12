import {
  Box,
  Button,
  Card,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setError("Please enter a valid username.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError('');

    try {
      const res = await login({username, password});
      if(res.success){
        navigate("/")
      }
    } catch (error) {
        setError(error.message || "Login Failed")
    }
  };

  return (
    <Container maxWidth="sm" sx={{display: 'flex', alignItems: 'center', height: '90dvh'}}>
      <Card variant="outlined" sx={{ p: 4, width: '100%' }}>
        <Typography variant="h5" mb={2}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={onSubmit} display="grid" gap={2}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" type="submit">
            Login
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default Login;
