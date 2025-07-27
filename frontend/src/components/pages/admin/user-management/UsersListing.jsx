import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../../../service/userService';
import inviteService from '../../../../service/inviteService';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Select, MenuItem, InputLabel, FormControl,
  Pagination, CircularProgress, Typography, Box, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { toast } from 'react-toastify';

const UsersListing = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Invite modal state
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers({ page, limit, search, role });
      setUsers(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleReset = () => {
    setSearch('');
    setRole('');
    setPage(1);
    fetchUsers();
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendInvite = async () => {
    if (!validateEmail(inviteEmail)) {
      setInviteError('Please enter a valid email address');
      return;
    }
    setInviteError('');
    setInviteLoading(true);

    try {
      await inviteService.sendInvite({ email: inviteEmail });
      toast.success('Invite sent successfully!');
      setOpenInviteModal(false);
      setInviteEmail('');
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error(error.response?.data?.error || 'Failed to send invite');
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <Box className="p-4">
      <Box className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <Typography variant="h5" className="font-semibold text-gray-800">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenInviteModal(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Admin
        </Button>
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <TextField
          label="Search by name/email"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <Box className="flex gap-2">
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box className="flex justify-center mt-10">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>Sno.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" style={{ fontSize: '1.2rem' }}>
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, idx) => (
                  <TableRow key={user._id}>
                    <TableCell>{(idx + 1) + (page - 1) * limit}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && users.length !== 0 && (
        <Box className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Invite Admin Modal */}
      <Dialog
        open={openInviteModal}
        onClose={() => setOpenInviteModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invite Admin</DialogTitle>
        <DialogContent>
          <TextField
            label="Admin Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            error={!!inviteError}
            helperText={inviteError}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenInviteModal(false)}
            color="secondary"
            disabled={inviteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendInvite}
            color="primary"
            variant="contained"
            disabled={inviteLoading}
            startIcon={
              inviteLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : null
            }
          >
            {inviteLoading ? 'Sending' : 'Send Invite'}
          </Button>

        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersListing;