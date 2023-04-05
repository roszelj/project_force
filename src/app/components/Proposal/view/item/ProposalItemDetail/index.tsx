/**
 *
 * ProposalItemDetail
 *
 */
import React, { useEffect, useState } from 'react';
//import styled from 'styled-components/macro';
import { initialState, useProposalDetailSlice } from './slice';
import { useSelector, useDispatch } from 'react-redux';

import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { selectProposalDetail, selectLoading } from './slice/selectors';
import { ISOtoLocaleString } from 'utils/firestoreDateUtil';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { stringToCurrency } from 'utils/currencyFormat';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Unstable_Grid2';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from 'app/components/CheckoutForm';

import Button, { ButtonProps } from '@mui/material/Button';
//import { A } from 'app/components/A';
import { ReactComponent as DocumentationIcon } from 'app/components/NavBar/assets/documentation-icon.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProjectStartCost } from 'app/components/ProjectStartCost';

import { selectLogin } from 'app/components/LoginForm/slice/selectors';

import { SaveCurrentRoute } from 'app/components/SaveCurrentRoute';

import "styles/stripe.css";

interface Props {
  id: any;
}

export function ProposalItemDetail({ id }: Props) {
  const [clientSecret, setClientSecret] = useState('');
  const [terms, setTerms] = useState([false, true]);
  const [termsError, setTermsError] = useState(false);
  const [termsName, setTermsName] = useState('');
  const [termsNameError, setTermsNameError] = useState(false);

  const loginData = useSelector(selectLogin);

  let navigate = useNavigate();

  const stripePromise = loadStripe(
    'pk_test_51MmOC6JNye0CcGyXNFquJ8DEUDOU6hfFCpDo1CrO8NTlFMWx2jn5dZuJllMaclEKV3LiTWUd6vhLNQcn3MDF1ydX00siPhyDMH',
  );

  const { actions } = useProposalDetailSlice();
  const dispatch = useDispatch();

  const data = useSelector(selectProposalDetail);

  const isLoading = useSelector(selectLoading);

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  useEffectOnMount(() => {
    dispatch(actions.getProposal(id));
  });

  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [paymentFormLoading, setPaymentFormLoading] = React.useState(false)

  const handleCheckoutOpen = () => {
    if (terms[0] == true && termsName > '') {

      if (data.deposit > 0 || data.payment_schedule != 0) {
        //dispatch(actions.toggleLoading(true));
        setCheckoutOpen(true);
      } else {

        loginData.currentUser.role === 'admin'
          ? navigate('/admin')
          : navigate('/');
      }
      //dispatch(actions.acceptTerms(true));
      
    } else {
      terms[0] == false ? setTermsError(true) : null;
      terms[0] == false ? setTermsError(true) : null;
      termsName == '' ? setTermsNameError(true) : null;
    }
  };

  const handleCheckoutClose = () => setCheckoutOpen(false);

  const handlePaymentOpen = () => setPaymentOpen(true);

  const handlePaymentClose = () => setPaymentOpen(false);

  const handlePayment = () => {
    // Create PaymentIntent as soon as the page loads
    setPaymentFormLoading(true);
    fetch(
      'https://us-central1-proposal-generator-f87ad.cloudfunctions.net/createPaymentIntent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { item: { id: data.id } } }),
      },
    )
      .then(res => res.json()).then(data => {setClientSecret(data.clientSecret), setPaymentFormLoading(false)});

    handleCheckoutClose();
    handlePaymentOpen();
  };

  const handleTerms = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerms([event.target.checked, event.target.checked]);

    if ((event.target.checked, event.target.checked == true)) {
      setTermsError(false);
    }
  };

  const handleTermsName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermsName(event.target.value);
    event.target.value > ''
      ? setTermsNameError(false)
      : setTermsNameError(true);
  };

  const DateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const lightTheme = createTheme({ palette: { mode: 'light' } });
  const darkTheme = createTheme({ palette: { mode: 'dark' } });

  const appearance = {
    theme: 'night',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <ThemeProvider theme={darkTheme}>
        <Box>
          <Card sx={{ p: 1, marginBottom: 2, background: '#bce8f1' }}>
            <Typography variant="h5" color="rgba(220,120,95,1)">
              {data.name}
            </Typography>
          </Card>
          <Paper
            variant="outlined"
            sx={{
              paddingTop: 0,
              paddingBottom: 3,
              paddingLeft: 3,
              paddingRight: 3,
            }}
          >
            <List
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            >
              <ListItem
                alignItems="flex-start"
                sx={{ paddingLeft: 0, paddingBottom: 0 }}
              >
                <ListItemText
                  primary={
                    <Div sx={{ paddingLeft: 0 }}>
                      <Typography
                        sx={{ display: 'inline', fontWeight: 'bold' }}
                        component="span"
                        color="text.primary"
                      >
                        Prepared For:
                      </Typography>

                      {' ' + data.prepared_for}
                    </Div>
                  }
                />
              </ListItem>
              <ListItem sx={{ paddingLeft: 0, paddingTop: 0 }}>
                <ListItemText>
                  <Typography color="rgba(220,120,95,1)">
                    {ISOtoLocaleString(data.createdOn, DateOptions)}
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Objective Summary
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="div"
                  sx={{ p: 1 }}
                >
                  {data.summary}
                </Typography>
              </CardContent>
            </Card>
            <Box sx={{ marginTop: 2, marginBottom: 2 }}>
              <Divider
                role="presentation"
                component="div"
                sx={{ textAlign: 'left' }}
              >
                <Typography variant="h6" color="rgba(220,120,95,1)">
                  Project Epics
                </Typography>
              </Divider>
            </Box>
            {data.project_items.map((detail, count) => (
              <Box key={count}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {detail.item_title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ p: 1 }}
                    >
                      {detail.description}
                    </Typography>

                    <Div>
                      <Typography
                        sx={{ display: 'inline', fontWeight: 'bold' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Time Estimation:
                      </Typography>

                      {' ' + detail.item_estimation}
                    </Div>
                  </CardContent>
                </Card>
                <Div>&nbsp;</Div>
              </Box>
            ))}
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} columns={8}>
                <Grid sx={{ marginTop: 2, marginRight: 2 }} xs={4}>
                  <Paper>
                    <TableContainer component="div">
                      <Table aria-label="simple table">
                        <TableHead></TableHead>
                        <TableBody>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Total Estimated Hours:
                            </TableCell>
                            <TableCell align="right">
                              {data.total_estimated_hours}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Estimated Completion:
                            </TableCell>
                            <TableCell align="right">
                              {data.estimated_completion_date}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Setup:
                            </TableCell>
                            <TableCell align="right">
                              {stringToCurrency(data.setup)}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Total Price:
                            </TableCell>
                            <TableCell align="right">
                              {stringToCurrency(data.price)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
                <Grid
                  sx={{ marginTop: 2, marginLeft: 0, marginRight: 2 }}
                  xs={4}
                >
                  {!data.accepted_terms ? (
                    <Paper>
                      <Box sx={{ padding: 2, border: '1px dashed grey' }}>
                        <Div sx={{ paddingLeft: 0 }}>
                          <Typography
                            sx={{
                              display: 'inline',
                              paddingLeft: 0,
                              fontWeight: 'bold',
                            }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Terms:
                          </Typography>
                          <A
                            href="https://bigbrightdigital.com/terms-conditions/"
                            target="parent"
                          >
                            <DocumentationIcon />
                            (Link)
                          </A>
                        </Div>
                        <FormGroup>
                          <FormControl sx={{ m: 1 }} variant="filled">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={terms[0]}
                                  onChange={handleTerms}
                                />
                              }
                              label="I agree to the terms & condidtions"
                            />
                            {termsError ? (
                              <span style={{ color: 'red' }}>
                                Terms must be accepted to continue
                              </span>
                            ) : null}
                          </FormControl>
                          <FormControl sx={{ m: 1 }} variant="filled">
                            <TextField
                              id="terms_name"
                              label="Name"
                              defaultValue=""
                              onChange={handleTermsName}
                            />
                            {termsNameError ? (
                              <span style={{ color: 'red' }}>
                                Provide you name to accept terms
                              </span>
                            ) : null}
                          </FormControl>
                          <FormControl sx={{ m: 1 }} variant="filled">
                            <Button
                              variant="contained"
                              onClick={handleCheckoutOpen}
                            >
                              Initiate Project
                            </Button>
                          </FormControl>
                        </FormGroup>
                      </Box>
                    </Paper>
                  ) : null}
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
        <Modal
          open={checkoutOpen}
          onClose={handleCheckoutClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ModalStyle>
            <Typography id="modal-modal-title" variant="h6" component={H2}>
              Proceed to Checkout
            </Typography>
           
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <ProjectStartCost />
            </Typography>
            <Box
              display="flex"
              m={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button variant="contained" size="large" onClick={handlePayment}>
                Checkout
              </Button>
            </Box>
          </ModalStyle>
        </Modal>

        <Modal
          open={paymentOpen}
          onClose={handlePaymentClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <ModalStyle>
            <Typography id="modal-modal-title" variant="h6" component={H2}>
              Proceed to Checkout
            </Typography>
            {paymentFormLoading && <LoadingIndicator strokeColor={'#ffffff'} />}
            <div className="App">
              {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm docId={data.docId} />
                </Elements>
              )}
            </div>
          </ModalStyle>
        </Modal>
      </ThemeProvider>
      <SaveCurrentRoute />
    </>
  );
}

const A = styled('a')(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const H2 = styled('h2')(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const DepositStyle = styled(Paper)(({ theme }) => ({
  ...theme.typography.h6,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));

const ModalStyle = styled(Box)({
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#898381', //'background.paper',
  border: '2px solid rgba(220,120,95,1)',
  boxShadow: 24,
  padding: 14,
  color: p => p.theme.palette.text.primary,
});

const Div = styled(Box)`
  color: ${p => p.theme.palette.text.primary};
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.43;
  letter-spacing: 0.01071em;
  padding: 8px;
`;

const OutlinedButton = styled(Button)<ButtonProps>`
  backgroundcolor: '#999999';
`;

const BootstrapButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: '#e0e6ec',
  borderColor: '#0063cc',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    backgroundColor: '#0069d9',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#0062cc',
    borderColor: '#005cbf',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
});
