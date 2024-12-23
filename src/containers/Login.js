import React from 'react';
import MuiCard from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../state/auth/authSlice';
import * as yup from 'yup';

import { LOADING } from '../state/statusEnum';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(4),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
}));

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const isLoading = status === LOADING;

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: yup.object({
      username: yup.string().required('Please enter your username'),
      password: yup.string().required('Please enter your password'),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { username, password } = values;
      const result = await dispatch(loginUser({ username, password }));
      if (loginUser.fulfilled.match(result)) {
        Swal.fire({
          icon: 'success',
          title: 'Login successful',
        }).then(() => navigate('/dashboard'));
      } else {
        Swal.fire({
          icon: 'error',
          title: result?.payload,
        });
      }
    },
  });

  return (
    <SignInContainer direction='column' justifyContent='space-between'>
      <Card variant='outlined'>
        <Typography
          component='h1'
          variant='h4'
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Sign in
        </Typography>
        <Box
          component='form'
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2.5,
          }}
        >
          <FormControl>
            <FormLabel htmlFor='username'>Username</FormLabel>
            <TextField
              id='username'
              type='username'
              name='username'
              placeholder='username'
              autoComplete='username'
              autoFocus
              required
              fullWidth
              variant='outlined'
              {...formik.getFieldProps('username')}
              error={Boolean(formik.errors.username)}
              helperText={formik.errors.username || ''}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='password'>Password</FormLabel>
            <TextField
              id='password'
              type='password'
              name='password'
              placeholder='••••••'
              autoComplete='current-password'
              autoFocus
              required
              fullWidth
              variant='outlined'
              {...formik.getFieldProps('password')}
              error={Boolean(formik.errors.password)}
              helperText={formik.errors.password || ''}
            />
          </FormControl>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            disabled={isLoading}
          >
            Sign in
          </Button>
        </Box>
      </Card>
    </SignInContainer>
  );
}

export default Login;
