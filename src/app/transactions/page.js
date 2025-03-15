'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Button, Card, CardContent, Grid, Box } from '@mui/material';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import TransactionFormModal from '@/components/TransactionFormModal';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    const demoData = [
      // { id: 1, amount: 50, date: '2023-01-01', description: 'Groceries', category: 'Food' },
      // { id: 2, amount: 20, date: '2023-01-05', description: 'Bus Ticket', category: 'Transport' },
      // { id: 3, amount: 100, date: '2023-01-10', description: 'Movie Night', category: 'Entertainment' },
    ];
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || JSON.stringify(demoData));
    setTransactions(storedTransactions);
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedTransaction(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    const updatedTransactions = transactions.filter(t => t.id !== selectedTransaction);
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setOpenDeleteModal(false);
    setSelectedTransaction(null);
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenFormModal(true);
  };

  const handleSubmitTransaction = (formData) => {
    const updatedTransactions = transactions.map(t => t.id === selectedTransaction.id ? { ...formData, id: t.id } : t);
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setOpenFormModal(false);
  };

  const handleOpenTransactionModal = () => {
    setSelectedTransaction({});
    setOpenFormModal(true);
  };

  return (
    <Container maxWidth="md">
      <Box my={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          Transactions
        </Typography>

      </Box>

      <Grid container spacing={3}>
        {transactions.map(transaction => (
          <Grid item xs={12} sm={6} key={transaction.id}>
            <Card variant="outlined" sx={{ margin: '10px', padding: '10px' }}>
              <CardContent>
                <Typography variant="body1" gutterBottom>{transaction.description}</Typography>
                <Typography variant="body2" color="textSecondary">{transaction.date}</Typography>
                <Typography variant="h6" gutterBottom>${transaction.amount}</Typography>
                <Typography variant="body2" color="textSecondary">Category: {transaction.category}</Typography>
                <Button variant="outlined" color="primary" onClick={() => handleEdit(transaction)}>
                  Edit
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => handleDeleteClick(transaction.id)}>
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ConfirmDeleteModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleConfirm={handleDeleteConfirm}
      />

      <TransactionFormModal
        open={openFormModal}
        handleClose={() => setOpenFormModal(false)}
        initialData={selectedTransaction}
        onSubmit={handleSubmitTransaction}
      />
    </Container>
  );
}