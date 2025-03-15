import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem } from '@mui/material';

export default function BudgetFormModal({ open, handleClose, onSubmit }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
  });

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.amount && !isNaN(formData.amount) && formData.category) {
      onSubmit(formData);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Set Budget</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Category"
          name="category"
          fullWidth
          margin="normal"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Budget Amount"
          type="number"
          name="amount"
          fullWidth
          margin="normal"
          value={formData.amount}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleSubmit} color="secondary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}