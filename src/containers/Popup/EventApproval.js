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
import moment from 'moment';

export const EventApprovalComponent = ({
  open,
  onClose,
  proposedDates,
  isApprove,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          console.log('Approval Submitted');
          onClose();
        },
      }}
    >
      <DialogTitle>Approval Event</DialogTitle>
      <DialogContent>
        {isApprove ? (
          <FormControl>
            <FormLabel id='confirmedDate'>Select confirmed date</FormLabel>
            <RadioGroup
              row
              aria-labelledby='confirmedDate'
              name='confirmedDate'
            >
              {proposedDates?.length &&
                proposedDates.map((date) => {
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
                label='Remarks for rejection'
                sx={{ minWidth: '50vh' }}
                variant='filled'
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button type='submit' variant='contained' size='small' color='primary'>
          Approve
        </Button>
        <Button
          onClick={onClose}
          variant='contained'
          size='small'
          color='error'
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
