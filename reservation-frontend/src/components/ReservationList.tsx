import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.locale('fr');
dayjs.extend(localizedFormat);

export interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  comment: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tab, setTab] = useState<"PENDING" | "ACCEPTED" | "PAST">("PENDING");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const prevLength = useRef(0);

  const fetchReservations = async () => {
    try {
      const res = await axios.get<Reservation[]>("http://localhost:8080/api/reservations");
      setReservations(res.data);

      if (res.data.length > prevLength.current) setOpenSnackbar(true);
      prevLength.current = res.data.length;
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    }
  };

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: number, action: "accept" | "reject") => {
    try {
      await axios.put(`http://localhost:8080/api/reservations/${id}/${action}`);
      fetchReservations();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const formatDateTime = (date: string, time: string) => {
    return dayjs(`${date}T${time}`).format("D MMMM [à] HH[h]mm");
  };

  const now = dayjs();

  const pastReservations = reservations
    .filter(r => dayjs(`${r.date}T${r.time}`).isBefore(now) || r.status === "REJECTED")
    .sort((a, b) => dayjs(`${b.date}T${b.time}`).unix() - dayjs(`${a.date}T${a.time}`).unix());

  const pendingReservations = reservations
    .filter(r => r.status === "PENDING")
    .sort((a, b) => dayjs(`${a.date}T${a.time}`).unix() - dayjs(`${b.date}T${b.time}`).unix());

  const acceptedReservations = reservations
    .filter(r => r.status === "ACCEPTED")
    .sort((a, b) => dayjs(`${a.date}T${a.time}`).unix() - dayjs(`${b.date}T${b.time}`).unix());

  const getNextReservation = () => {
    const futureAccepted = acceptedReservations.filter(r => dayjs(`${r.date}T${r.time}`).isAfter(now));
    return futureAccepted.length > 0 ? futureAccepted[0] : null;
  };

  const nextReservation = getNextReservation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue as any);
  };

  const displayedReservations = tab === "PENDING" ? pendingReservations
    : tab === "ACCEPTED" ? acceptedReservations
    : pastReservations;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
        Liste des réservations
      </Typography>

      {/* Prochaine course */}
      {nextReservation && (
        <>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'green', textAlign: 'center' }}>
            Votre prochaine course
          </Typography>
          <Card variant="outlined" sx={{ mb: 4, p: 2, borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{nextReservation.name}</Typography>
              <Typography>{nextReservation.email} | {nextReservation.phone}</Typography>
              <Typography sx={{ mt: 1, fontSize: '1.1rem' }}>
                {formatDateTime(nextReservation.date, nextReservation.time)}
              </Typography>
              <Typography sx={{ mt: 1, fontStyle: 'italic' }}>{nextReservation.comment}</Typography>
            </CardContent>
          </Card>
          <Divider sx={{ mb: 3 }} />
        </>
      )}

      {/* Onglets */}
      <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
        <Tab label="Passée" value="PAST" />
        <Tab label="Pending" value="PENDING" />
        <Tab label="Acceptée" value="ACCEPTED" />
      </Tabs>

      {/* Liste des réservations */}
      <Grid container spacing={3}>
        {displayedReservations.map(r => (
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                borderColor: r.status === "PENDING" ? "orange" : r.status === "ACCEPTED" ? "green" : "grey",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.03)" }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>{r.name}</Typography>
                <Typography color="textSecondary">{r.email} | {r.phone}</Typography>
                <Typography sx={{ mt: 1 }}>{formatDateTime(r.date, r.time)}</Typography>
                {r.comment && <Typography sx={{ mt: 1, fontStyle: "italic" }}>{r.comment}</Typography>}
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    mt: 2,
                    color: r.status === "PENDING" ? "orange" : r.status === "ACCEPTED" ? "green" : "red",
                    textAlign: 'center'
                  }}
                >
                  {r.status}
                </Typography>
              </CardContent>
              {r.status === "PENDING" && (
                <CardActions sx={{ justifyContent: "center", mb: 1 }}>
                  <Button variant="contained" color="success" onClick={() => updateStatus(r.id, "accept")}>Accepter</Button>
                  <Button variant="contained" color="error" onClick={() => updateStatus(r.id, "reject")}>Refuser</Button>
                </CardActions>
              )}
            </Card>
        ))}
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="info" sx={{ width: '100%' }}>
          Nouvelle réservation reçue !
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReservationList;
