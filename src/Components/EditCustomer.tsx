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
import EditIcon from "@mui/icons-material/Edit";
import type { Customer } from "../types/Customer";
import { updateCustomer, type NewCustomerData } from "../api/Items";

interface EditCustomerProps {
  customer: Customer;
  onCustomerUpdated: () => void;
}

const toEditableCustomer = (customer: Customer): NewCustomerData => ({
  firstname: customer.firstname,
  lastname: customer.lastname,
  streetaddress: customer.streetaddress,
  postcode: customer.postcode,
  city: customer.city,
  email: customer.email,
  phone: customer.phone,
});

export default function EditCustomer({
  customer,
  onCustomerUpdated,
}: EditCustomerProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewCustomerData>(
    toEditableCustomer(customer),
  );

  const handleOpen = () => {
    setFormData(toEditableCustomer(customer));
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    if (saving) {
      return;
    }
    setOpen(false);
    setError(null);
  };

  const handleChange = (field: keyof NewCustomerData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await updateCustomer(customer._links.self.href, formData);
      onCustomerUpdated();
      setOpen(false);
    } catch (err) {
      console.error("Error updating customer:", err);
      setError("Failed to update customer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <IconButton
        color="primary"
        aria-label={`Edit ${customer.firstname} ${customer.lastname}`}
        onClick={handleOpen}
      >
        <EditIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="First name"
              value={formData.firstname}
              onChange={(e) => handleChange("firstname", e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Last name"
              value={formData.lastname}
              onChange={(e) => handleChange("lastname", e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Street address"
              value={formData.streetaddress}
              onChange={(e) => handleChange("streetaddress", e.target.value)}
              fullWidth
            />
            <TextField
              label="Postcode"
              value={formData.postcode}
              onChange={(e) => handleChange("postcode", e.target.value)}
              fullWidth
            />
            <TextField
              label="City"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
            />
            <TextField
              label="Phone"
              value={formData.phone}
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
