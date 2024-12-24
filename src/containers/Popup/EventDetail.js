import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import moment from 'moment';
import { EventStatus, verify as user } from '../../utils';
import { UserRole } from '../../utils/enums/userRole';

export const EventDetailComponent = ({
  selectorEventDetailData,
  open,
  onClose,
  onOpenApproval,
}) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Detail event</DialogTitle>
      <DialogContent>
        {selectorEventDetailData.isLoading ? (
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
          <Grid container spacing={1}>
            <Grid size={12}>
              <TextField
                id='name'
                label='Name'
                variant='filled'
                sx={{ width: '100%' }}
                disabled={true}
                aria-readonly
                value={selectorEventDetailData.data?.name}
              />
            </Grid>
            <Grid size={8}>
              <TextField
                id='nameVendor'
                label='Name Vendor'
                sx={{ width: '100%' }}
                variant='filled'
                disabled={true}
                value={selectorEventDetailData.data?.vendorName}
              />
            </Grid>
            <Grid size={4}>
              <TextField
                id='status'
                label='Status'
                variant='filled'
                disabled={true}
                value={selectorEventDetailData.data?.status}
              />
            </Grid>
            <Grid size={12} pt={2}>
              <Typography fontSize={15}>Proposed dates</Typography>
            </Grid>
            <Grid size={12}>
              <Grid container spacing={1}>
                {selectorEventDetailData.data?.proposedDates?.map((date) => {
                  return (
                    <Chip
                      label={moment(date, 'DD-MM-YYYY').format('DD MMMM YYYY')}
                    />
                  );
                })}
              </Grid>
            </Grid>
            {selectorEventDetailData.data?.status === EventStatus.Approved && (
              <Grid container pt={2}>
                <Grid size={12}>
                  <Typography fontSize={15}>Confirmed date</Typography>
                </Grid>
                <Grid container spacing={1}>
                  <Chip
                    sx={{ width: '100%' }}
                    label={moment(
                      selectorEventDetailData.data?.confirmedDate
                    ).format('DD MMMM YYYY')}
                  />
                </Grid>
              </Grid>
            )}
            <Grid size={12} pt={2}>
              <Typography fontSize={15}>Location</Typography>
            </Grid>
            <Grid size={4}>
              <TextField
                id='locationPostalCode'
                label='Postal code'
                variant='filled'
                disabled={true}
                aria-readonly
                value={selectorEventDetailData.data?.locationPostalCode}
              />
            </Grid>
            <Grid size={8}>
              <TextField
                id='fullLocation'
                label='Full location'
                variant='filled'
                sx={{ width: '100%' }}
                disabled={true}
                value={selectorEventDetailData.data?.fullLocation}
              />
            </Grid>
            <Grid size={8} pt={2}>
              <Typography fontSize={15}>Remarks</Typography>
            </Grid>
            <Grid size={4} pt={2}>
              <Typography fontSize={15}>Created date</Typography>
            </Grid>
            <Grid size={8}>
              <TextField
                id='remarks'
                label='Remarks'
                disabled={true}
                sx={{ width: '100%' }}
                value={
                  selectorEventDetailData.data?.remarks
                    ? selectorEventDetailData.data?.remarks
                    : '-'
                }
                variant='filled'
              />
            </Grid>
            <Grid size={4}>
              <Chip
                label={moment(selectorEventDetailData.data?.createdAt).format(
                  'DD-MM-YYYY HH:mm:ss'
                )}
              />
            </Grid>
            {user()?.role === UserRole.Vendor &&
              selectorEventDetailData.data?.status === EventStatus.Pending && (
                <Grid item xs={12} sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    type='submit'
                    variant='contained'
                    size='small'
                    onClick={() => onOpenApproval(true)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant='contained'
                    size='small'
                    color='error'
                    onClick={() => onOpenApproval(false)}
                  >
                    Reject
                  </Button>
                </Grid>
              )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          size='small'
          color='error'
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
