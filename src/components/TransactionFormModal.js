import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField,
  DialogActions, Button, MenuItem
} from '@mui/material';
import { toast } from 'react-toastify';

export default function TransactionFormModal({ open, handleClose, initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    category: '',
  });

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    if (!formData.date) {
      toast.error('Date is required');
      return;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    onSubmit(formData);
    handleClose();
  };

  const isEditMode = formData && formData.id;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{isEditMode ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Amount"
          type="number"
          name="amount"
          fullWidth
          margin="normal"
          value={formData.amount}
          onChange={handleChange}
        />
        <TextField
          label="Date"
          type="date"
          name="date"
          fullWidth
          margin="normal"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleSubmit} color="secondary">{isEditMode ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
}