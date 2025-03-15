import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Finance Visualizer
        </Typography>
        <Button color="inherit" component={Link} href="/">Dashboard</Button>
        <Button color="inherit" component={Link} href="/transactions">Transactions</Button>
      </Toolbar>
    </AppBar>
  );
}