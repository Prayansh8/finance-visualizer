'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, Card, CardContent, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import TransactionFormModal from '@/components/TransactionFormModal';
import BudgetFormModal from '@/components/BudgetFormModal';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [openBudgetModal, setOpenBudgetModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const storedBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    setTransactions(storedTransactions);
    setBudgets(storedBudgets);
  }, []);

  const calculateCategoryData = (transactions) => {
    const categorySum = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + parseFloat(transaction.amount);
      return acc;
    }, {});
    return Object.entries(categorySum).map(([name, value]) => ({ name, value }));
  };

  const calculateBudgetComparison = () => {
    return budgets.map(budget => {
      const spent = transactions
        .filter(t => t.category === budget.category)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      return { category: budget.category, budget: budget.amount, spent };
    });
  };

  const calculateMonthlyExpenses = () => {
    const monthlyExpenses = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).getMonth();
      acc[month] = (acc[month] || 0) + parseFloat(transaction.amount);
      return acc;
    }, {});
    return Object.keys(monthlyExpenses).map(month => ({
      month: new Date(2023, month).toLocaleString('default', { month: 'short' }),
      amount: monthlyExpenses[month],
    }));
  };

  const categoryData = calculateCategoryData(transactions);
  const totalExpenses = transactions.reduce((acc, t) => acc + parseFloat(t.amount), 0);
  const totalBudget = budgets.reduce((acc, b) => acc + parseFloat(b.amount), 0);
  const budgetComparison = calculateBudgetComparison();
  const monthlyData = calculateMonthlyExpenses();
  const COLORS = ['#2e7d32', '#d32f2f', '#ff9800', '#1976d2'];

  const handleOpenTransactionModal = (transaction = {}) => {
    setSelectedTransaction(transaction);
    setOpenTransactionModal(true);
  };

  const handleOpenBudgetModal = () => {
    setOpenBudgetModal(true);
  };

  const handleSubmitTransaction = (formData) => {
    const updatedTransactions = selectedTransaction?.id
      ? transactions.map(t => t.id === selectedTransaction.id ? { ...formData, id: t.id } : t)
      : [...transactions, { ...formData, id: Date.now() }];

    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  const handleSetBudget = (formData) => {
    const updatedBudgets = budgets.map(b => b.category === formData.category ? { ...formData, amount: parseFloat(formData.amount) } : b);
    if (!updatedBudgets.some(b => b.category === formData.category)) {
      updatedBudgets.push({ ...formData, amount: parseFloat(formData.amount) });
    }
    setBudgets(updatedBudgets);
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
  };

  return (
    <Container maxWidth="lg">
      <Box my={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          Transactions
        </Typography>
        <Box>
          <Button variant="contained" color="success" startIcon={<span>+</span>} onClick={handleOpenTransactionModal} sx={{ mr: 2 }}>
            Add Transaction
          </Button>
          <Button variant="outlined" color="primary" onClick={handleOpenBudgetModal}>
            Set Budget
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 2 }}>
        {/* {transactions.length > 0 && ( */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ bgcolor: '#2e2e2e', color: '#fff' }}>
              <CardContent>
                <Typography variant="h6" align="center">Total Expenses</Typography>
                <Typography variant="h4" align="center">${totalExpenses}</Typography>
              </CardContent>
            </Card>
          </Grid>
        {/* )} */}

        {/* {budgets.length > 0 && ( */}
          <Grid item xs={12} sm={6}>
            <Card sx={{ bgcolor: '#2e2e2e', color: '#fff' }}>
              <CardContent>
                <Typography variant="h6" align="center">Total Budget</Typography>
                <Typography variant="h4" align="center">${totalBudget}</Typography>
              </CardContent>
            </Card>
          </Grid>
        {/* )} */}
      </Grid>

      {transactions.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Card sx={{ bgcolor: '#2e2e2e', color: '#fff' }}>
              <CardContent>
                <Typography variant="h6" align="center">Most Recent Transactions</Typography>
                <ul style={{ padding: 0, listStyleType: 'none', margin: 0 }}>
                  {transactions.slice(-3).map(t => (
                    <li key={t.id}>
                      <Typography variant="body1">
                        {t.description} - ${t.amount} on {t.date}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {categoryData.length > 0 && (
        <>
          <Typography variant="h6" align="center" gutterBottom>Category Breakdown</Typography>
          <PieChart width={400} height={400} style={{ margin: '0 auto' }}>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label={(entry) => `${entry.name}: $${entry.value}`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </>
      )}

      {budgetComparison.length > 0 && (
        <>
          <Typography variant="h6" align="center" gutterBottom>Budget vs Actual</Typography>
          <BarChart width={500} height={300} data={budgetComparison} style={{ margin: '0 auto' }}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#82ca9d" />
            <Bar dataKey="spent" fill="#ff5252" />
          </BarChart>
        </>
      )}

      {monthlyData.length > 0 && (
        <>
          <Typography variant="h6" align="center" gutterBottom>Monthly Expenses</Typography>
          <BarChart width={500} height={300} data={monthlyData} style={{ margin: '0 auto' }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#29b6f6" />
          </BarChart>
        </>
      )}

      {budgetComparison.length > 0 && (
        <>
          <Typography variant="h6" align="center" gutterBottom>Spending Insights</Typography>
          <ul style={{ padding: 0, listStyleType: 'none', textAlign: 'center' }}>
            {budgetComparison.map(({ category, budget, spent }) => (
              <li key={category}>
                <Typography>{category}: Budget = ${budget}, Spent = ${spent} {spent > budget ? '- Over budget' : '- Within budget'}</Typography>
              </li>
            ))}
          </ul>

          <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            {budgetComparison.map(({ category, budget, spent }) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Card sx={{ bgcolor: '#3e3e3e', color: '#fff' }}>
                  <CardContent>
                    <Typography variant="h6" align="center">{category || 'Unknown Category'}</Typography>
                    <Typography align="center">Budget: ${budget}</Typography>
                    <Typography align="center">Spent: ${spent}</Typography>
                    <Typography align="center" color={spent > budget ? 'error' : 'success'}>
                      {spent > budget ? 'Over budget' : 'Within budget'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <TransactionFormModal
        open={openTransactionModal}
        handleClose={() => setOpenTransactionModal(false)}
        initialData={selectedTransaction || {}}
        onSubmit={handleSubmitTransaction}
      />

      <BudgetFormModal
        open={openBudgetModal}
        handleClose={() => setOpenBudgetModal(false)}
        onSubmit={handleSetBudget}
      />
    </Container>
  );
}