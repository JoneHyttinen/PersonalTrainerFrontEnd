import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import { addCustomer, type NewCustomerData } from "../api/Items";

interface AddCustomerProps {
  onCustomerAdded: () => void;
}

const initialCustomer: NewCustomerData = {
  firstname: "",
  lastname: "",
  streetaddress: "",
  postcode: "",
  city: "",
  email: "",
  phone: "",
};

export default function AddCustomer({ onCustomerAdded }: AddCustomerProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<NewCustomerData>(initialCustomer);

  const handleOpen = () => {
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    if (saving) {
      return;
    }
    setOpen(false);
    setError(null);
    setCustomer(initialCustomer);
  };

  const handleChange = (field: keyof NewCustomerData, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await addCustomer(customer);
      onCustomerAdded();
      handleClose();
    } catch (err) {
      console.error("Error adding customer:", err);
      setError("Failed to add customer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <IconButton size="small" aria-label="Add customer" onClick={handleOpen}>
        <AddBoxRoundedIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="First name"
              value={customer.firstname}
              onChange={(e) => handleChange("firstname", e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Last name"
              value={customer.lastname}
              onChange={(e) => handleChange("lastname", e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Street address"
              value={customer.streetaddress}
              onChange={(e) => handleChange("streetaddress", e.target.value)}
              fullWidth
            />
            <TextField
              label="Postcode"
              value={customer.postcode}
              onChange={(e) => handleChange("postcode", e.target.value)}
              fullWidth
            />
            <TextField
              label="City"
              value={customer.city}
              onChange={(e) => handleChange("city", e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={customer.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
            />
            <TextField
              label="Phone"
              value={customer.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              fullWidth
            />
            {error && <Typography color="error">{error}</Typography>}
          </Stack>
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
