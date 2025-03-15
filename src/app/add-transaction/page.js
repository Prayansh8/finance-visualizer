'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TextField, Button, MenuItem, Typography, Container } from '@mui/material';

export default function AddTransaction() {
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    description: '',
    category: '',
  });
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const transaction = transactions.find((t) => t.id === parseInt(id, 10));
      if (transaction) setFormData(transaction);
    }
  }, [id]);

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      setMessage('Invalid amount');
      return false;
    }
    if (!formData.date) {
      setMessage('Date is required');
      return false;
    }
    if (!formData.description.trim()) {
      setMessage('Description is required');
      return false;
    }
    if (!formData.category) {
      setMessage('Category is required');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

    if (id) {
      const index = transactions.findIndex((t) => t.id === parseInt(id, 10));
      transactions[index] = { ...formData, id: parseInt(id, 10) };
      setMessage('Transaction updated successfully!');
    } else {
      transactions.push({ ...formData, id: Date.now() });
      setMessage('Transaction added successfully!');
    }

    localStorage.setItem('transactions', JSON.stringify(transactions));
    setFormData({ amount: '', date: '', description: '', category: '' });
    router.push('/transactions');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Transaction' : 'Add Transaction'}
      </Typography>
      <form onSubmit={handleSubmit}>
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
          label="Description"
          type="text"
          name="description"
          fullWidth
          margin="normal"
          value={formData.description}
          onChange={handleChange}
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {id ? 'Update' : 'Add'} Transaction
        </Button>
        {message && <Typography color="error">{message}</Typography>}
      </form>
    </Container>
  );
}