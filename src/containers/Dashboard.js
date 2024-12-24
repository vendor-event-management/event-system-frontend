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
import Typography from '@mui/material/Typography';
import moment from 'moment';

import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { EventStatus, verify as user } from '../utils';
import { getEvents } from '../state/event/eventSlice';
import { getDetailEvent } from '../state/event/eventDetailSlice';
import { EventDetailComponent } from './Popup/EventDetail';
import { EventApprovalComponent } from './Popup/EventApproval';
import { EventCreationComponent } from './Popup/EventCreation';
import { UserRole } from '../utils/enums/userRole';

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
  const [openPopupApproval, setOpenPopupApproval] = React.useState(false);
  const [openPopupCreation, setOpenPopupCreation] = React.useState(false);
  const [isApproveEvent, setIsApproveEvent] = React.useState(false);

  const selectorEventData = useSelector((state) => state.event);
  const selectorEventDetailData = useSelector((state) => state.eventDetail);

  const dispatch = useDispatch();
  const userId = user()?.id;

  const handleClickOpenPopup = (event) => {
    dispatch(getDetailEvent({ id: event.id }));
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleClickOpenPopupApproval = (isApprove) => {
    setIsApproveEvent(isApprove);
    setOpenPopupApproval(true);
  };

  const handleClosePopupApproval = () => {
    setOpenPopupApproval(false);
  };

  const handleClickOpenPopupCreation = () => {
    setOpenPopupCreation(true);
  };

  const handleClosePopupCreation = () => {
    setOpenPopupCreation(false);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      status: '',
      page: 1,
      size: 10,
    },
    onSubmit: async (values) => {
      console.log(values);

      dispatch(getEvents({ userId, ...values }));
    },
  });

  const handleClearSearch = () => {
    formik.resetForm();
    dispatch(getEvents({ userId }));
  };

  useEffect(() => {
    dispatch(getEvents({ userId }));
  }, [dispatch, userId]);

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
                <Grid size={12}>
                  <Stack direction='row' paddingBottom={4} spacing={4}>
                    <TextField
                      id='name'
                      name='name'
                      label='Name event'
                      variant='standard'
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
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
                        onBlur={formik.handleBlur}
                        {...formik.getFieldProps('status')}
                      >
                        <MenuItem value=''>
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={EventStatus.Pending}>Pending</MenuItem>
                        <MenuItem value={EventStatus.Approved}>
                          Approved
                        </MenuItem>
                        <MenuItem value={EventStatus.Rejected}>
                          Rejected
                        </MenuItem>
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
                        onClick={() => handleClearSearch()}
                      >
                        Clear
                      </Button>
                    </Box>
                    {user().role === UserRole.HR && (
                      <Box
                        sx={{
                          paddingTop: 2,
                          display: 'flex',
                          flexGrow: 1,
                        }}
                      >
                        {' '}
                        <Button
                          variant='contained'
                          size='small'
                          sx={{ marginLeft: 'auto' }}
                          onClick={() => handleClickOpenPopupCreation()}
                        >
                          Create event
                        </Button>
                      </Box>
                    )}
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
                                  height: '50px',
                                }}
                              >
                                <CircularProgress />
                              </Box>
                            </TableCell>
                          </TableRow>
                        ) : !selectorEventData.data?.content?.length ? (
                          <TableRow>
                            <TableCell colSpan={7}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  height: '50px',
                                }}
                              >
                                <Typography>No event data</Typography>
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
                                    label={moment(date, 'DD-MM-YYYY').format(
                                      'DD MMM YYYY'
                                    )}
                                    variant='outlined'
                                    sx={{ m: 0.2 }}
                                  />
                                ))}
                              </StyledTableCell>
                              <StyledTableCell align='right'>
                                {row.confirmedDate ? (
                                  <Chip
                                    label={moment(row.confirmedDate).format(
                                      'DD MMM YYYY'
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
      <EventDetailComponent
        selectorEventDetailData={selectorEventDetailData}
        open={openPopup}
        onClose={handleClosePopup}
        onOpenApproval={handleClickOpenPopupApproval}
      />
      <EventApprovalComponent
        open={openPopupApproval}
        onClosePopupApproval={handleClosePopupApproval}
        onClosePopupDetail={handleClosePopup}
        event={selectorEventDetailData?.data}
        isApprove={isApproveEvent}
      />
      <EventCreationComponent
        open={openPopupCreation}
        onClose={handleClosePopupCreation}
      />
    </React.Fragment>
  );
}

export default Dashboard;
