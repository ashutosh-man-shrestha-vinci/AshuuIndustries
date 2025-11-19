import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("fr");
dayjs.extend(localizedFormat);

const ReservationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(1);
  const [bags, setBags] = useState(0);
  const [comment, setComment] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    date: "",
    people: "",
    bags: "",
  });

  const pricePerPerson = 20;

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", phone: "", date: "", people: "", bags: "" };

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Email invalide";
      valid = false;
    }

   

    if (!date || dayjs(date).isBefore(dayjs(), "day")) {
      newErrors.date = "La date doit être aujourd'hui ou ultérieure";
      valid = false;
    }

    if (people < 1 || people > 4) {
      newErrors.people = "Nombre de personnes maximum 4";
      valid = false;
    }

    if (bags < 0 || bags > 5) {
      newErrors.bags = "Nombre de valises maximum 5";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const totalPrice = people * pricePerPerson;
    const fullComment = `${comment} | Nombre de personnes: ${people}, Valises: ${bags}, Prix total: ${totalPrice}€`;

    try {
      await axios.post("http://localhost:8080/api/reservations", {
        name,
        email,
        phone,
        date: date?.format("YYYY-MM-DD"),
        time,
        comment: fullComment,
      });

      setOpenSnackbar(true);
      setName("");
      setEmail("");
      setPhone("");
      setDate(dayjs());
      setTime("");
      setPeople(1);
      setBags(0);
      setComment("");
      setErrors({ email: "", phone: "", date: "", people: "", bags: "" });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la réservation");
    }
  };

  const snowStyle = `
    body { background-color: #0b0b0b; }
    .snow-wrapper { position: relative; overflow: hidden; min-height: 100vh; padding-top: 40px; }
    .snow { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2; }
    .snowflake {
      position: absolute;
      top: -10px;
      width: 6px;
      height: 6px;
      background-color: white;
      border-radius: 50%;
      opacity: 0.9;
      animation: fall linear infinite;
    }
    @keyframes fall {
      to { transform: translateY(110vh); }
    }
  `;

  const snowflakes = Array.from({ length: 200 }).map((_, idx) => ({
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 6 + 2}px`,
    duration: `${Math.random() * 10 + 5}s`,
    delay: `${Math.random() * 10}s`,
  }));

  return (
    <div className="snow-wrapper">
      <style>{snowStyle}</style>

      <div className="snow">
        {snowflakes.map((flake, idx) => (
          <div
            key={idx}
            className="snowflake"
            style={{
              left: flake.left,
              width: flake.size,
              height: flake.size,
              animationDuration: flake.duration,
              animationDelay: flake.delay,
            }}
          />
        ))}
      </div>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          maxWidth: 500,
          mx: "auto",
          borderTop: "4px solid green",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          position: "relative",
          zIndex: 3,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          sx={{ color: "green", fontWeight: "bold" }}
        >
          ❄️ Réserver un créneau
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField label="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          <TextField
            label="Téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            required
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.date,
                  helperText: errors.date,
                },
              }}
            />
          </LocalizationProvider>

          <TextField
            label="Heure"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
            required
          />

          <TextField
            label="Nombre de personnes"
            type="number"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            inputProps={{ min: 1, max: 4 }}
            error={!!errors.people}
            helperText={errors.people}
            required
          />
          <TextField
            label="Nombre de valises"
            type="number"
            value={bags}
            onChange={(e) => setBags(Number(e.target.value))}
            inputProps={{ min: 0, max: 5 }}
            error={!!errors.bags}
            helperText={errors.bags}
          />
          <TextField
            label="Adresse / Commentaire"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
            ❄️ Prix total: {people * pricePerPerson}€
          </Typography>

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 1,
              backgroundColor: "green",
              "&:hover": { backgroundColor: "#006400" },
            }}
          >
            Réserver
          </Button>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" onClose={() => setOpenSnackbar(false)} sx={{ bgcolor: "green", color: "white" }}>
            ❄️ Réservation envoyée !
          </Alert>
        </Snackbar>
      </Paper>
    </div>
  );
};

export default ReservationForm;
