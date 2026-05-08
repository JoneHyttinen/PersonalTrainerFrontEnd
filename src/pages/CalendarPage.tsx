import { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { Training } from "../types/Training";
import { getTrainings, getCustomerByLink } from "../api/Items";
import {
  Box,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    activity: string;
    duration: number;
    trainingLink: string;
    customerName: string;
  };
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const loadTrainings = useCallback(async () => {
    try {
      setLoading(true);
      const trainingsData = await getTrainings();

      // Transform trainings to calendar events
      const calendarEvents: CalendarEvent[] = await Promise.all(
        trainingsData.map(async (training: Training) => {
          const startDate = new Date(training.date);
          const endDate = new Date(
            startDate.getTime() + training.duration * 60000,
          );

          // Fetch customer details using the customer link
          const customer = await getCustomerByLink(
            training._links.customer.href,
          );
          const customerName = customer
            ? `${customer.firstname} ${customer.lastname}`
            : "Unknown";

          return {
            id: training._links.self.href,
            title: `${training.activity} / ${customerName}`,
            start: startDate,
            end: endDate,
            resource: {
              activity: training.activity,
              duration: training.duration,
              trainingLink: training._links.self.href,
              customerName: customerName,
            },
          };
        }),
      );

      setEvents(calendarEvents);
      setError(null);
    } catch (err) {
      console.error("Error loading trainings:", err);
      setError("Failed to load trainings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Defer calling loadTrainings so we don't synchronously call setState from
    // inside the effect (avoids cascading render warning).
    const timer = setTimeout(() => {
      loadTrainings();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadTrainings]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  if (loading) {
    return <Typography>Loading trainings...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ width: "100%", height: "100vh", display: "flex" }}>
      <Paper
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        elevation={0}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ flex: 1 }}
          view={view}
          onView={(newView: View) => setView(newView)}
          views={["month", "week", "day"]}
          date={date}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          popup
          selectable
        />
      </Paper>

      <Dialog open={selectedEvent !== null} onClose={handleCloseDialog}>
        <DialogTitle>Training Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box sx={{ pt: 2, minWidth: 300 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Activity:</strong> {selectedEvent.resource.activity}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Customer:</strong> {selectedEvent.resource.customerName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Start:</strong>{" "}
                {format(selectedEvent.start, "PPpp", { locale: enUS })}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>End:</strong>{" "}
                {format(selectedEvent.end, "PPpp", { locale: enUS })}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Duration:</strong> {selectedEvent.resource.duration}{" "}
                minutes
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
