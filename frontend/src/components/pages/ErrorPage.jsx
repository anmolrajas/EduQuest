import React from 'react'
import { useRouteError, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { 
  Home, 
  RefreshCw, 
  AlertTriangle, 
  ArrowLeft 
} from 'lucide-react'

const ErrorPage = () => {
  const error = useRouteError()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  console.log(error)

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2
      }
    }
  }

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Container maxWidth="md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Floating Error Icon */}
          <motion.div
            variants={iconVariants}
            animate={floatingAnimation}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-2xl">
              <AlertTriangle className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          {/* Main Error Card */}
          <motion.div variants={itemVariants}>
            <Card 
              elevation={0}
              className="backdrop-blur-sm bg-white/80 border border-gray-200/50 shadow-xl"
              sx={{
                borderRadius: 4,
                overflow: 'visible'
              }}
            >
              <CardContent className="p-8 md:p-12">
                <motion.div variants={itemVariants}>
                  <Typography
                    variant={isMobile ? "h3" : "h2"}
                    component="h1"
                    className="font-bold text-gray-800 mb-4"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Oops! Something went wrong
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h6"
                    className="text-gray-600 mb-6 leading-relaxed"
                  >
                    We encountered an unexpected error. Don't worry, our team has been notified and we're working to fix it.
                  </Typography>
                </motion.div>

                {/* Error Details */}
                {error && (
                  <motion.div variants={itemVariants}>
                    <Box 
                      className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left"
                    >
                      <Typography
                        variant="subtitle2"
                        className="text-red-800 font-semibold mb-2"
                      >
                        Error Details:
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-red-700 font-mono text-sm break-all"
                      >
                        {error.message || error.data || error.statusText || 'Unknown error occurred'}
                      </Typography>
                      {error.status && (
                        <Typography
                          variant="body2"
                          className="text-red-600 mt-2"
                        >
                          Status: {error.status}
                        </Typography>
                      )}
                    </Box>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div variants={itemVariants}>
                  <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={2}
                    justifyContent="center"
                    className="mt-8"
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGoHome}
                      startIcon={<Home className="w-5 h-5" />}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      sx={{
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Go Home
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleGoBack}
                      startIcon={<ArrowLeft className="w-5 h-5" />}
                      className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                      sx={{
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Go Back
                    </Button>

                    <Button
                      variant="text"
                      size="large"
                      onClick={handleRefresh}
                      startIcon={<RefreshCw className="w-5 h-5" />}
                      className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                      sx={{
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Refresh Page
                    </Button>
                  </Stack>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer Message */}
          <motion.div variants={itemVariants} className="mt-8">
            <Typography
              variant="body2"
              className="text-gray-500"
            >
              If this problem persists, please contact our support team.
            </Typography>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  )
}

export default ErrorPage