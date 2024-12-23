import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { verify } from '../utils';
import { getEvents } from '../state/event/eventSlice';
import { getDetailEvent } from '../state/event/eventDetailSlice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function Dashboard() {
  const [openPopup, setOpenPopup] = React.useState(false);
  const dispatch = useDispatch();
  const selectorEventData = useSelector((state) => state.event);
  const selectorEventDetailData = useSelector((state) => state.eventDetail);

  const handleClickOpenPopup = (event) => {
    dispatch(getDetailEvent({ id: event.id }));
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      status: '',
      page: 1,
      size: 10,
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      console.log('values : ', values);
    },
  });

  useEffect(() => {
    const userId = verify()?.id;
    dispatch(getEvents({ userId }));
  }, [dispatch]);

  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Box sx={{ flexGrow: 1, marginTop: 10, padding: 1 }}>
            <Paper
              sx={{
                padding: 3,
              }}
            >
              <Box component='form' noValidate onSubmit={formik.handleSubmit}>
                <Grid size={8}>
                  <Stack direction='row' paddingBottom={4} spacing={4}>
                    <TextField
                      id='name'
                      name='name'
                      label='Name event'
                      variant='standard'
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      {...formik.getFieldProps('name')}
                    />
                    <FormControl variant='standard' sx={{ minWidth: 120 }}>
                      <InputLabel id='status'>Status</InputLabel>
                      <Select
                        labelId='status'
                        id='status'
                        label='Status'
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        {...formik.getFieldProps('status')}
                      >
                        <MenuItem value=''>
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={'Pending'}>Pending</MenuItem>
                        <MenuItem value={'Approved'}>Approved</MenuItem>
                        <MenuItem value={'Rejected'}>Rejected</MenuItem>
                      </Select>
                    </FormControl>
                    <Box
                      sx={{
                        paddingTop: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Button type='submit' variant='contained' size='small'>
                        Search
                      </Button>
                      <Button
                        variant='contained'
                        size='small'
                        color='error'
                        onSubmit={() => formik.resetForm()}
                      >
                        clear
                      </Button>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Name event</StyledTableCell>
                          <StyledTableCell align='right'>
                            Name vendor
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            Proposed date
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            Confirmed date
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            Status
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            Created at
                          </StyledTableCell>
                          <StyledTableCell align='right'>
                            Action
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectorEventData.isLoading ? (
                          <TableRow>
                            <TableCell colSpan={7}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  height: '100px', // Atur tinggi area spinner
                                }}
                              >
                                <CircularProgress />
                              </Box>
                            </TableCell>
                          </TableRow>
                        ) : (
                          selectorEventData.data?.content?.map((row) => (
                            <StyledTableRow key={row.id}>
                              <StyledTableCell component='th' scope='row'>
                                {row.name}
                              </StyledTableCell>
                              <StyledTableCell align='right'>
                                {row.vendorName}
                              </StyledTableCell>
                              <StyledTableCell align='right'>
                                {row.proposedDates?.map((date) => (
                                  <Chip
                                    label={date}
                                    variant='outlined'
                                    sx={{ m: 0.2 }}
                                  />
                                ))}
                              </StyledTableCell>
                              <StyledTableCell align='right'>
                                {row.confirmedDate ? (
                                  <Chip
                                    label={moment(row.confirmedDate).format(
                                      'DD-MM-YYYY'
                                    )}
                                    variant='outlined'
                                    sx={{ m: 0.2 }}
                                  />
                                ) : (
                                  '-'
                                )}
                              </StyledTableCell>
                              <StyledTableCell align='right'>
                                {row.status}
                              </StyledTableCell>
                              <StyledTableCell align='right'>
                                {moment(row.createdAt).format(
                                  'DD-MM-YYYY HH:mm:ss'
                                )}
                              </StyledTableCell>
                              <StyledTableCell align='right'>
                                <Button
                                  variant='contained'
                                  size='small'
                                  onClick={() => handleClickOpenPopup(row)}
                                >
                                  Detail
                                </Button>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid size={4}>
                  <Box sx={{ paddingTop: 2 }}>
                    <Pagination
                      count={selectorEventData.pagination?.totalPages}
                      color='primary'
                    />
                  </Box>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
          },
        }}
      >
        <DialogTitle>Detail event</DialogTitle>
        <DialogContent>
          {selectorEventDetailData.isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px', // Atur tinggi area spinner
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              component='form'
              sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
              noValidate
              autoComplete='off'
            >
              <TextField
                id='name'
                label='Name'
                variant='filled'
                disabled={true}
                aria-readonly
                value={selectorEventDetailData.data?.name}
              />
              <TextField
                id='nameVendor'
                label='Name Vendor'
                variant='filled'
                disabled={true}
                value={selectorEventDetailData.data?.vendorName}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={['DatePicker', 'DatePicker', 'DatePicker']}
                >
                  <DatePicker label='disabled' disabled />
                  <DatePicker label='readOnly' readOnly />
                  <DatePicker label='name' name='startDate' />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Cancel</Button>
          <Button type='submit'>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Dashboard;
