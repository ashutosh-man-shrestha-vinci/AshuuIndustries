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
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Container,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

const ReservationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState("");
  const [people, setPeople] = useState(1);
  const [bags, setBags] = useState(0);
  const [direction, setDirection] = useState<"aller" | "retour">("aller");
  const [comment, setComment] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const totalPrice = people * 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trajet = direction === "aller"
      ? "Jette → Aéroport de Zaventem"
      : "Aéroport de Zaventem → Jette";

    const fullComment = `${comment ? comment + "\n" : ""}Trajet: ${trajet}\nPersonnes: ${people} | Valises: ${bags} | Prix: ${totalPrice}€`;

    try {
      await axios.post("http://localhost:8080/api/reservations", {
        name, email, phone,
        date: date.format("YYYY-MM-DD"),
        time, comment: fullComment,
      });

      setOpenSnackbar(true);
      setName(""); setEmail(""); setPhone(""); setTime(""); setPeople(1); setBags(0); setComment("");
    } catch {
      alert("Erreur → WhatsApp direct : 0467 01 70 68");
    }
  };

  return (
    <>
      {/* Neige simple */}
      <style>{`
        body { margin: 0; background: linear-gradient(#e0f2fe, #bae6fd); min-height: 100vh; }
        .snow { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
        .flake { position: absolute; top: -10px; background: white; border-radius: 50%; opacity: 0.9; animation: fall linear infinite; }
        @keyframes fall { to { transform: translateY(110vh); } }
      `}</style>

      <div className="snow">
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} className="flake" style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 5 + 3}px`,
            height: `${Math.random() * 5 + 3}px`,
            animation: `fall ${Math.random() * 15 + 10}s linear infinite ${Math.random() * 10}s`,
          }} />
        ))}
      </div>

      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", position: "relative" }}>
        {/* Bannière */}
        <Box sx={{ bgcolor: "#16a34a", color: "white", py: 3, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold">Jette ↔ Zaventem</Typography>
          <Typography variant="h6">7j/7 – Rapide & Sympa</Typography>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* FLEX AU LIEU DE GRID → PLUS JAMAIS D'ERREUR */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
            
            {/* FORMULAIRE */}
            <Box sx={{ flex: { md: 7 }, width: "100%" }}>
              <Paper sx={{ p: 4, border: "5px solid #22c55e", borderRadius: 4 }}>
                <Typography variant="h4" textAlign="center" color="#16a34a" fontWeight="bold" mb={3}>
                  Réserve ton trajet
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                  <FormControl fullWidth>
                    <InputLabel>Trajet</InputLabel>
                    <Select value={direction} onChange={(e) => setDirection(e.target.value as any)}>
                      <MenuItem value="aller">Jette → Aéroport</MenuItem>
                      <MenuItem value="retour">Aéroport → Jette</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField label="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
                  <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <TextField label="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} required />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="Date" value={date} onChange={(v) => v && setDate(v)} />
                  </LocalizationProvider>

                  <TextField label="Heure" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />

                  <TextField label="Personnes (max 4)" type="number" value={people} onChange={(e) => setPeople(Number(e.target.value))}
                    inputProps={{ min: 1, max: 4 }} required />

                  <TextField label="Valises" type="number" value={bags} onChange={(e) => setBags(Number(e.target.value))}
                    inputProps={{ min: 0, max: 5 }} />

                  <TextField label="Commentaire (vol, adresse...)" multiline rows={3} value={comment}
                    onChange={(e) => setComment(e.target.value)} />

                  <Box sx={{ bgcolor: "#f0fdf4", p: 3, borderRadius: 2, textAlign: "center" }}>
                    <Typography variant="h5" color="#16a34a" fontWeight="bold">
                      Total : {totalPrice} €
                    </Typography>
                  </Box>

                  <Button type="submit" variant="contained" size="large" sx={{ bgcolor: "#16a34a", py: 2 }}>
                    Réserver maintenant
                  </Button>
                </Box>
              </Paper>
            </Box>

            {/* À PROPOS */}
            <Box sx={{ flex: { md: 5 }, width: "100%" }}>
              <Paper sx={{ p: 4, bgcolor: "#f0fdf4", height: "100%" }}>
                <Box textAlign="center" mb={3}>
                  <Avatar sx={{ width: 100, height: 100, mx: "auto", mb: 2, bgcolor: "#22c55e" }}>A</Avatar>
                  <Typography variant="h5" fontWeight="bold" color="#16a34a">
                    Salut, c’est Ashu !
                  </Typography>
                </Box>

                <Typography sx={{ lineHeight: 1.8 }}>
                  Je m’appelle Ashutosh, tout le monde m’appelle <strong>Ashu</strong>.<br /><br />
                  20 ans, étudiant en développement logiciel à Léonard de Vinci.<br /><br />
                  Je fais ces trajets pour rendre service!.<br /><br />
                  Site qui bug ? → <strong>WhatsApp direct, je réponds très vite</strong>
                </Typography>

                <Box textAlign="center" mt={4}>
                  <Button variant="contained" size="large" href="https://wa.me/32467017068" target="_blank"
                    sx={{ bgcolor: "#25D366", "&:hover": { bgcolor: "#128C7E" } }}>
                    WhatsApp 0467 01 70 68
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>

        <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity="success" sx={{ bgcolor: "#22c55e", color: "white" }}>
            Réservation envoyée ! Je te réponds très vite
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default ReservationForm;