import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CircularProgress, 
  TextField, 
  Typography, 
  Container, 
  InputAdornment, 
  IconButton,
  Fade,
  LinearProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  AdminPanelSettings, 
  CheckCircle,
  Security,
  ErrorOutline 
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import inviteService from '../../service/inviteService';

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await inviteService.verifyInvite(token);
        setInviteData(res);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Invalid or expired invite');
        setInviteData({ valid: false });
      } finally {
        setLoading(false);
      }
    };

    if (token) verify();
    else {
      setInviteData({ valid: false });
      setLoading(false);
    }
  }, [token]);

  const handleAccept = async () => {
    setProcessing(true);
    try {
      await inviteService.acceptInvite({ token });
      toast.success('Admin privileges activated successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to accept invitation');
    } finally {
      setProcessing(false);
    }
  };

  const handleSignup = async () => {
    if (!name.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setProcessing(true);
    try {
      await inviteService.signupWithInvite({
        token,
        email: inviteData.email,
        password,
        name: name.trim()
      });
      toast.success('Admin account created successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create admin account');
    } finally {
      setProcessing(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CircularProgress 
            size={48} 
            thickness={4} 
            sx={{ color: '#3b82f6', mb: 2 }} 
          />
          <Typography variant="body1" className="text-slate-600 font-medium">
            Verifying invitation...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  // Invalid Invite State
  if (!inviteData?.valid) {
    return (
      <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 text-center max-w-md shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <Box className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ErrorOutline className="text-red-500 text-3xl" />
            </Box>
            <Typography variant="h5" className="font-semibold mb-3 text-slate-800">
              Invalid Invitation
            </Typography>
            <Typography className="text-slate-600 mb-6 leading-relaxed">
              This invitation link has expired or is no longer valid. Please contact your administrator for a new invitation.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
              className="px-6 py-2"
              sx={{
                borderColor: '#64748b',
                color: '#475569',
                '&:hover': { 
                  backgroundColor: '#f8fafc',
                  borderColor: '#3b82f6'
                }
              }}
            >
              Return Home
            </Button>
          </Card>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            {/* Progress Bar */}
            <AnimatePresence>
              {processing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LinearProgress 
                    sx={{ 
                      height: 3,
                      backgroundColor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #3b82f6, #6366f1)'
                      }
                    }} 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <Box className="bg-gradient-to-r from-slate-600 via-blue-600 to-indigo-600 p-8 text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Security className="text-4xl text-white" />
              </motion.div>
              <Typography variant="h4" className="font-bold mb-2 text-white">
                Admin Invitation
              </Typography>
              <Typography className="text-blue-100 text-lg">
                Complete your administrator setup
              </Typography>
            </Box>

            {/* Content */}
            <Box className="p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 mb-6 border border-emerald-200"
              >
                <Box className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-600" />
                  <Box>
                    <Typography variant="body2" className="text-emerald-700 font-medium">
                      Invitation for
                    </Typography>
                    <Typography variant="h6" className="text-emerald-800 font-semibold">
                      {inviteData.email}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>

              <AnimatePresence mode="wait">
                {inviteData.existingUser ? (
                  <motion.div
                    key="existing-user"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography className="text-gray-600 mb-6 text-center leading-relaxed">
                      Your account has been found. Click below to activate your administrator privileges.
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleAccept}
                      disabled={processing}
                      className="py-3 text-lg font-medium shadow-lg"
                      sx={{
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        '&:hover': { 
                          background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                        },
                        '&:disabled': { backgroundColor: '#9ca3af' },
                        textTransform: 'none',
                        borderRadius: 2,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {processing ? (
                        <Box className="flex items-center gap-2">
                          <CircularProgress size={20} color="inherit" />
                          Activating...
                        </Box>
                      ) : (
                        'Activate Admin Role'
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="new-user"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography className="text-gray-600 mb-6 text-center leading-relaxed">
                      Create your administrator account to get started with full access.
                    </Typography>
                    
                    <Box className="space-y-4">
                      <TextField
                        label="Full Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={processing}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#3b82f6' },
                            '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: 2 }
                          },
                          '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' }
                        }}
                        style={{ marginBottom: '16px', marginTop: '8px' }}
                      />

                      <TextField
                        type={showPassword ? 'text' : 'password'}
                        label="Create Password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={processing}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton 
                                onClick={() => setShowPassword(!showPassword)} 
                                edge="end"
                                disabled={processing}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        helperText="Must be at least 6 characters long"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#3b82f6' },
                            '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: 2 }
                          },
                          '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' }
                        }}
                        style={{ marginBottom: '16px' }}
                      />
                    </Box>

                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleSignup}
                      disabled={processing}
                      className="mt-6 py-3 text-lg font-medium shadow-lg"
                      sx={{
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        '&:hover': { 
                          background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                        },
                        '&:disabled': { backgroundColor: '#9ca3af' },
                        textTransform: 'none',
                        borderRadius: 2,
                        mt: 3,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {processing ? (
                        <Box className="flex items-center gap-2">
                          <CircularProgress size={20} color="inherit" />
                          Creating Account...
                        </Box>
                      ) : (
                        'Create Admin Account'
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 pt-6 border-t border-gray-100"
              >
                <Typography variant="body2" className="text-gray-500 text-center">
                  By proceeding, you agree to the administrator terms and conditions.
                </Typography>
              </motion.div>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AcceptInvite;