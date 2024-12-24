import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { getPortfolioQuote } from '../api/projectsApi';
import { PortfolioItem, PortfolioResponse } from '../types';

const UserTab: React.FC = () => {
  const [tons, setTons] = useState<string>('');
  const [quote, setQuote] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [allocatedTons, setAllocatedTons] = useState<number>(0);
  const [unallocatedTons, setUnallocatedTons] = useState<number>(0);

  const handleSubmit = async () => {
    const numTons = Number(tons);
    if (isNaN(numTons) || numTons <= 0) {
      alert('Please enter a valid number of tons');
      return;
    }

    try {
      const response: PortfolioResponse = await getPortfolioQuote(numTons);
      setPortfolio(response.portfolio);
      setAllocatedTons(response.allocatedTons);
      setTotalPrice(response.totalPrice);
      setUnallocatedTons(response.unallocatedTons);
      setQuote(`Quote for ${tons} tons: ${response.totalPrice.toFixed(2)}`);
    } catch (error) {
      alert('Error fetching portfolio quote');
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setTons(value);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" mb={2}>Generate Portfolio</Typography>
      <TextField
        label="Tons"
        fullWidth
        type="text"
        value={tons}
        onChange={handleChange}
        placeholder="Enter tons (e.g., 1000)"
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSubmit}>Generate Portfolio</Button>

      {quote && <Typography mt={2}>{quote}</Typography>}

      {portfolio.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" mb={2}>Generated Portfolio</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Supplier Name</TableCell>
                  <TableCell>Allocated Tons</TableCell>
                  <TableCell>Price per Ton</TableCell>
                  <TableCell>Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {portfolio.map((project) => (
                  <TableRow key={project.projectId}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.country}</TableCell>
                    <TableCell>{project.allocatedTons.toFixed(2)}</TableCell>
                    <TableCell>{project.price / project.allocatedTons}</TableCell>
                    <TableCell>{project.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={2}>
            <Typography variant="body1">
              <strong>Total Allocated Tons:</strong> {allocatedTons}
            </Typography>
            <Typography variant="body1">
              <strong>Total Price:</strong> {totalPrice.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              <strong>Unallocated Tons:</strong> {unallocatedTons}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserTab;
