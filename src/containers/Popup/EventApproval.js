import React from 'react';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import moment from 'moment';

import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { EventStatus, verify as user } from '../../utils';
import { approveOrRejectEvent } from '../../state/event/eventApprovalSlice';
import { getEvents } from '../../state/event/eventSlice';

export const EventApprovalComponent = ({
  open,
  onClosePopupApproval,
  onClosePopupDetail,
  event,
  isApprove,
}) => {
  const selectorEventApproval = useSelector((state) => state.eventApproval);
  const dispatch = useDispatch();

  const userId = user()?.id;

  const formik = useFormik({
    initialValues: {
      remarks: '',
      confirmedDate: '',
    },
    onSubmit: async (values) => {
      const payload = {
        status: isApprove ? EventStatus.Approved : EventStatus.Rejected,
        eventId: event.id,
        ...values,
      };
      const result = await dispatch(approveOrRejectEvent(payload));
      if (approveOrRejectEvent.fulfilled.match(result)) {
        onClosePopupApproval();
        onClosePopupDetail();
        Swal.fire({
          icon: 'success',
          title: `Event ${payload.status.toLowerCase()}`,
        }).then(() => dispatch(getEvents({ userId })));
      } else {
        Swal.fire({
          icon: 'error',
          title: result?.payload,
        });
      }
    },
  });

  return (
    <Dialog
      open={open}
      PaperProps={{
        component: 'form',
        onSubmit: formik.handleSubmit,
      }}
    >
      <DialogTitle>Approval Event</DialogTitle>
      <DialogContent>
        {isApprove ? (
          <FormControl>
            <FormLabel id='confirmedDate'>Select confirmed date</FormLabel>
            <RadioGroup
              row
              id='confirmedDate'
              aria-labelledby='confirmedDate'
              name='confirmedDate'
              value={formik.values.confirmedDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              {...formik.getFieldProps('confirmedDate')}
            >
              {event.proposedDates?.length &&
                event.proposedDates.map((date) => {
                  return (
                    <FormControlLabel
                      value={date}
                      control={<Radio />}
                      label={moment(date, 'DD-MM-YYYY').format('DD MMMM YYYY')}
                    />
                  );
                })}
            </RadioGroup>
          </FormControl>
        ) : (
          <Grid container spacing={1}>
            <Grid size={12}>
              <TextField
                id='remarks'
                name='remarks'
                label='Remarks for rejection'
                sx={{ minWidth: '50vh' }}
                variant='filled'
                value={formik.values.remarks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                {...formik.getFieldProps('remarks')}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        {selectorEventApproval.isLoading && <CircularProgress size='25px' />}
        <Button
          type='submit'
          variant='contained'
          size='small'
          color='primary'
          disabled={
            selectorEventApproval.isLoading ||
            (!formik.values.confirmedDate?.length &&
              !formik.values.remarks?.length)
          }
        >
          {isApprove ? 'Approve' : 'Submit'}
        </Button>
        <Button
          onClick={() => {
            onClosePopupApproval();
            formik.resetForm();
          }}
          variant='contained'
          size='small'
          color='error'
          disabled={selectorEventApproval.isLoading}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
