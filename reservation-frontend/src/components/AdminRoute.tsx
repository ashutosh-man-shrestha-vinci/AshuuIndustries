import React, { useState } from "react";
import ReservationList from "./ReservationList";
import { TextField, Button, Box, Typography } from "@mui/material";

const AdminRoute: React.FC = () => {
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    if (password === "Annie") setIsAdmin(true);
    else alert("Mot de passe incorrect !");
  };

  return isAdmin ? (
    <ReservationList />
  ) : (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" textAlign="center">Connexion Admin</Typography>
      <TextField
        label="Mot de passe"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button variant="contained" onClick={handleLogin}>Se connecter</Button>
    </Box>
  );
};

export default AdminRoute;
