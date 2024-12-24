import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Swal from 'sweetalert2';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from 'dayjs';
import * as yup from 'yup';

import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { getVendors } from '../../state/user/vendorSlice';
import { createEvent } from '../../state/event/eventCreationSlice';
import { getEvents } from '../../state/event/eventSlice';
import { verify as user } from '../../utils';

export const EventCreationComponent = ({ open, onClose }) => {
  const selectorVendorData = useSelector((state) => state.userVendors);
  const selectorEventCreationData = useSelector((state) => state.eventCreation);
  const dispatch = useDispatch();

  const userId = user()?.id;

  const formik = useFormik({
    initialValues: {
      name: '',
      postalCode: '',
      location: '',
      firstProposedDate: null,
      secondProposedDate: null,
      thirdProposedDate: null,
      vendorId: '',
    },
    validationSchema: yup.object({
      name: yup.string().required('Please enter event name'),
      postalCode: yup
        .string()
        .matches(/^\d+$/, 'Postal code must be numeric')
        .min(5, 'Postal code must be at least 5 digits')
        .min(5, 'Postal code must not exceed 10 digits')
        .required('Please enter event location postal code'),
      firstProposedDate: yup
        .date()
        .nullable()
        .required('All proposal dates must be filled out'),
      secondProposedDate: yup
        .date()
        .nullable()
        .required('All proposal dates must be filled out'),
      thirdProposedDate: yup
        .date()
        .nullable()
        .required('All proposal dates must be filled out'),
      vendorId: yup.string().required('Please enter event vendor'),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const proposedDates = [
        dayjs(values.firstProposedDate).format('DD-MM-YYYY'),
        dayjs(values.secondProposedDate).format('DD-MM-YYYY'),
        dayjs(values.thirdProposedDate).format('DD-MM-YYYY'),
      ];
      const payload = {
        proposedDates,
        name: values.name,
        postalCode: values.postalCode,
        location: values.location,
        vendorId: values.vendorId,
      };
      const result = await dispatch(createEvent(payload));
      if (createEvent.fulfilled.match(result)) {
        onClose();
        formik.resetForm();
        Swal.fire({
          icon: 'success',
          title: `Event created`,
        }).then(() => dispatch(getEvents({ userId })));
      } else {
        Swal.fire({
          icon: 'error',
          title: result?.payload,
        });
      }
    },
  });

  useEffect(() => {
    open && dispatch(getVendors());
  }, [dispatch, open]);

  return (
    <Dialog
      open={open}
      PaperProps={{
        component: 'form',
        onSubmit: formik.handleSubmit,
      }}
    >
      <DialogTitle>Create event</DialogTitle>
      <DialogContent>
        {selectorVendorData.isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100px',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} width='70vh'>
            <Grid size={12}>
              <TextField
                id='name'
                label='Name'
                variant='standard'
                fullWidth
                aria-readonly
                {...formik.getFieldProps('name')}
                error={Boolean(formik.errors.name)}
                helperText={formik.errors.name || ''}
              />
            </Grid>
            <Grid size={12}>
              <FormControl
                variant='standard'
                fullWidth
                error={Boolean(
                  formik.touched.vendorId && formik.errors.vendorId
                )}
              >
                <InputLabel id='vendorId'>Vendor</InputLabel>
                <Select
                  labelId='vendorId'
                  id='vendorId'
                  label='Vendor'
                  {...formik.getFieldProps('vendorId')}
                >
                  {selectorVendorData.data?.length &&
                    selectorVendorData.data.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.fullName}
                        </MenuItem>
                      );
                    })}
                </Select>
                <FormHelperText>
                  {formik.touched.vendorId && formik.errors.vendorId}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={12} pt={2}>
              <Typography fontSize={15}>Propose dates</Typography>
            </Grid>
            <Grid size={5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    name='firstProposedDate'
                    value={formik.values.firstProposedDate}
                    onChange={(newValue) => {
                      formik.setFieldValue('firstProposedDate', newValue);
                    }}
                    label='First date'
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid size={5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    name='secondProposedDate'
                    value={formik.values.secondProposedDate}
                    onChange={(newValue) => {
                      formik.setFieldValue('secondProposedDate', newValue);
                    }}
                    label='Second date'
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid size={5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    name='thirdProposedDate'
                    value={formik.values.thirdProposedDate}
                    onChange={(newValue) => {
                      formik.setFieldValue('thirdProposedDate', newValue);
                    }}
                    label='Third date'
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid size={12}>
              <Typography fontSize={13} color='red'>
                {formik.errors.firstProposedDate ||
                  formik.errors.secondProposedDate ||
                  formik.errors.thirdProposedDate}
              </Typography>
            </Grid>
            <Grid size={12} pt={2}>
              <Typography fontSize={15}>Location</Typography>
            </Grid>
            <Grid size={4}>
              <TextField
                id='postalCode'
                label='Postal code'
                variant='standard'
                name='postalCode'
                aria-readonly
                {...formik.getFieldProps('postalCode')}
                error={Boolean(formik.errors.postalCode)}
                helperText={formik.errors.postalCode || ''}
              />
            </Grid>
            <Grid size={8}>
              <TextField
                id='fullLocation'
                label='Full location'
                variant='standard'
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        {selectorEventCreationData.isLoading && (
          <CircularProgress size='25px' />
        )}
        <Button
          type='submit'
          variant='contained'
          size='small'
          disabled={selectorEventCreationData.isLoading}
        >
          Create
        </Button>
        <Button
          onClick={() => {
            onClose();
            formik.resetForm();
          }}
          variant='contained'
          size='small'
          color='error'
          disabled={selectorEventCreationData.isLoading}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
