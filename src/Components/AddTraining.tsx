import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { type Dayjs } from "dayjs";
import type { Customer } from "../types/Customer";
import { addTraining } from "../api/Items";

interface AddTrainingProps {
  customer: Customer;
  onTrainingAdded: () => void;
}

interface TrainingFormState {
  date: Dayjs | null;
  duration: string;
  activity: string;
}

const initialTraining: TrainingFormState = {
  date: dayjs(),
  duration: "",
  activity: "",
};

export default function AddTraining({
  customer,
  onTrainingAdded,
}: AddTrainingProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [training, setTraining] = useState<TrainingFormState>(initialTraining);

  const handleOpen = () => {
    setError(null);
    setTraining(initialTraining);
    setOpen(true);
  };

  const handleClose = () => {
    if (saving) {
      return;
    }
    setOpen(false);
    setError(null);
    setTraining(initialTraining);
  };

  const handleSave = async () => {
    if (!training.date) {
      setError("Please select a date");
      return;
    }

    const durationNumber = Number(training.duration);
    if (!Number.isFinite(durationNumber) || durationNumber <= 0) {
      setError("Duration must be a positive number");
      return;
    }

    if (!training.activity.trim()) {
      setError("Please enter an activity");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await addTraining({
        date: training.date.toISOString(),
        duration: durationNumber,
        activity: training.activity.trim(),
        customer: customer._links.self.href,
      });
      onTrainingAdded();
      handleClose();
    } catch (err) {
      console.error("Error adding training:", err);
      setError("Failed to add training");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button size="small" sx={{ whiteSpace: "nowrap" }} onClick={handleOpen}>
        ADD TRAINING
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Add Training for {customer.firstname} {customer.lastname}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <DateTimePicker
                label="Date"
                value={training.date}
                onChange={(newValue) =>
                  setTraining((prev) => ({ ...prev, date: newValue }))
                }
              />
              <TextField
                label="Duration (minutes)"
                type="number"
                value={training.duration}
                onChange={(e) =>
                  setTraining((prev) => ({ ...prev, duration: e.target.value }))
                }
                fullWidth
                required
              />
              <TextField
                label="Activity"
                value={training.activity}
                onChange={(e) =>
                  setTraining((prev) => ({ ...prev, activity: e.target.value }))
                }
                fullWidth
                required
              />
              {error && <Typography color="error">{error}</Typography>}
            </Stack>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
