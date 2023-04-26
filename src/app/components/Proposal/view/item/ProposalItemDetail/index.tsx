/**
 *
 * ProposalItemDetail
 *
 */
import React, { useEffect, useState, useRef } from 'react';
//import styled from 'styled-components/macro';
import { initialState, useProposalDetailSlice } from './slice';
import { useSelector, useDispatch } from 'react-redux';

import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { selectProposalDetail, selectLoading } from './slice/selectors';
import { ISOtoLocaleString } from 'utils/firestoreDateUtil';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { stringToCurrency } from 'utils/currencyFormat';

import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

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
//import Grid from '@mui/material/Unstable_Grid2';

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
import { TabNaviation } from 'app/components/Proposal/TabNavigation';
import Grid from '@mui/material/Grid';
import { themes } from 'styles/theme/themes';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { EpicMenu } from 'app/components/Proposal/EpicMenu';
import { StoriesAccordion } from 'app/components/Proposal/StoriesAccordion';
import { EpicEditModal } from 'app/components/EpicEditModal';
import { StoryEditModal } from 'app/components/StoryEditModal';
import { AssetManager } from 'app/components/AssetManager';
import { ProjectMenu } from 'app/components/ProjectMenu';
import { InviteModal } from 'app/components/InviteModal';
import { ContributorsModal } from 'app/components/ContributorsModal';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import { ProjectAppBar } from 'app/components/ProjectAppBar';
import { StringAvatar } from 'app/components/StringAvatar';
import Tooltip from '@mui/material/Tooltip';

import 'styles/stripe.css';

interface Props {
  id: any;
}

export function ProposalItemDetail({ id }: Props) {
  const [clientSecret, setClientSecret] = useState('');
  const [terms, setTerms] = useState([false, true]);
  const [termsError, setTermsError] = useState(false);
  const [termsName, setTermsName] = useState('');
  const [termsNameError, setTermsNameError] = useState(false);

  const [permission, setPermission] = useState('');

  const epicEditRef: any = useRef();

  const storyEditRef: any = useRef();

  const inviteRef: any = useRef();

  const contributorsRef: any = useRef();

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
    //useEffect(effect, []);
  };

  useEffect(() => {
    dispatch(actions.getProposal(id));
  }, []);

  useEffect(() => {
    if (typeof data.name !== 'undefined') {
      getPermissions();
    }
  }, [data]);

  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [paymentFormLoading, setPaymentFormLoading] = React.useState(false);

  const handleCheckoutOpen = () => {
    if (terms[0] == true && termsName > '') {
      if (data.payment_schedule != 0) {
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
      .then(res => res.json())
      .then(data => {
        setClientSecret(data.clientSecret), setPaymentFormLoading(false);
      });

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

  //const lightTheme = createTheme({ palette: { mode: 'light' } });
  //const darkTheme = createTheme({palette: themes.dark.palette});
  const darkTheme = createTheme({
    palette: {
      background: {
        default: '#222222',
      },
      primary: {
        // Purple and green play nicely together.
        main: 'rgba(220,120,95,1)',
      },
      secondary: {
        // This is green.A700 as hex.
        main: 'rgba(241,233,231,0.6)',
      },
      mode: 'dark',
    },
  });

  const handleEditEpic = epicId => {
    
    epicEditRef.current.openModal(data.project_items[epicId]);
  };

  const handleEditStory = (storyData, epicId) => {
    const contributors = [{owner_uid: data.owner_uid, name: data.owner_name},...data.contributors]
    storyEditRef.current.openModal(storyData, epicId, contributors);
  };

  const handleAddStory = (epicId, totalStories) => {
    const nextId = totalStories + 1;
    const contributors = [{owner_uid: data.owner_uid, name: data.owner_name},...data.contributors]
  
    storyEditRef.current.openModal(null, epicId, contributors, nextId);
  };

  const handleInvite = () => {
    inviteRef.current.openModal();
  };

  const handleContributors = () => {
    contributorsRef.current.openModal();
  };

  const appearance = {
    theme: 'night',
  };

  const options = {
    clientSecret,
    appearance,
  };
  /*
  const getProjectRole = () => {
    if (loginData.currentUser.uid === data.admin_uid) {
      return 'admin';
    } else if (loginData.currentUser.uid === data.client_uid) {
      return 'client';
    } else {
      return 'contributor';
    }
  };
  */

  const getPermissions = () => {
    if (loginData.currentUser.uid === data.owner_uid) {
      setPermission('owner');
    } else {
      const contributor_role = data.contributors.find(
        p => p.uid === loginData.currentUser.uid,
      );
      if (contributor_role.type === 'admin') {
        setPermission('admin');
      } else if (contributor_role.type === 'client') {
        setPermission('client');
      } else {
        setPermission('contributor');
      }
    }
  };

  const filteredEpics = () => {
    if (permission === 'contributor') {
      const contributors_epics = data.contributors.find(
        p => p.uid === loginData.currentUser.uid,
      );
      const e = data.project_items.filter(ele =>
        contributors_epics.epics.find(e => e === ele._id),
      );
      return e;
    } else {
      return data.project_items;
    }
  };

  const filter = filteredEpics();

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <ThemeProvider theme={darkTheme}>
        {/*
      <Box sx={{position:"fixed", width:"100%", zIndex:1, display:"flex"}}>
       <Box sx={{width:"960px", display:"flex",}}>
        <HeaderCard sx={{width:"100%", maxWidth:"960px"}}>
              
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="baseline"
                spacing={1}
                sx={{ }}
              >
          
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ flexGrow: 1, alignItems: 'baseline' }}
                  color="secondary"
                >
                  {data.name}
                </Typography>

                <ProjectMenu handleInvite={handleInvite} />

              </Stack>
              
            </HeaderCard>
            </Box>
  </Box>*/}

        <ProjectAppBar
          handleInvite={handleInvite}
          handleContributors={handleContributors}
          role={permission}
          id={data.id}
          title={data.name}
        />
        <Box sx={{ padding: 0 }}>
          <Paper
            variant="outlined"
            sx={{
              paddingBottom: 3,
              paddingLeft: 3,
              paddingRight: 3,
            }}
          >
            {permission !== 'contributor' ? (
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <ListItem
                  alignItems="flex-start"
                  sx={{ paddingLeft: 0, paddingBottom: 0, paddingRight: 0 }}
                >
                  <ListItemText
                    primary={
                      <Div sx={{ paddingLeft: 0 }}>
                        <Typography
                          sx={{ display: 'inline', fontWeight: 'bold' }}
                          component="span"
                          color="text.secondary"
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
                    <Typography color="primary">
                      {ISOtoLocaleString(data.createdOn, DateOptions)}
                    </Typography>
                  </ListItemText>
                </ListItem>
              </List>
            ) : (
              <Div></Div>
            )}
            <Card>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  color="primary"
                  component="div"
                >
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
            {filter.map((detail, count) => (
              <Box key={count}>
                <Card>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      spacing={2}
                      sx={{ width: '100%' }}
                    >
                      <Typography
                        gutterBottom
                        variant="h5"
                        color="primary"
                        component="div"
                        sx={{ width: '75%', flexShrink: 0 }}
                      >
                        {detail.item_title}
                      </Typography>
                      <Typography
                        sx={{ width: '100%', textAlign: 'right' }}
                        variant="body2"
                        color="secondary"
                      >
                        {detail.status}
                      </Typography>
                    </Stack>

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
                        color="secondary"
                      >
                        Time Estimation:
                      </Typography>

                      {' ' + detail.item_estimation}
                    </Div>
                    {detail.stories?.length ? (
                      <div>
                        <Divider
                          role="presentation"
                          component="div"
                          sx={{ textAlign: 'left' }}
                        >
                          <Typography variant="h6" color="primary">
                            Stories
                          </Typography>
                        </Divider>
                        <StoriesAccordion
                          handleEditStory={handleEditStory}
                          epicId={detail._id}
                          stories={detail.stories}
                          role={permission}
                        />
                      </div>
                    ) : null}
                    <div>
                      <Divider
                        role="presentation"
                        component="div"
                        sx={{ textAlign: 'left' }}
                      ></Divider>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon color="secondary" />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography variant="h6" color="secondary">
                            <PermMediaIcon color="secondary" />
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: '0px' }}>
                          <AssetManager
                            docId={data.docId}
                            epicId={detail._id}
                          />
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </CardContent>

                  <Stack
                    direction="row"
                    component="div"
                    spacing={2}
                    sx={{ display: 'flex', flexGrow: 1, paddingBottom: 1 }}
                    divider={<Divider orientation="vertical" flexItem />}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexGrow: 1,
                        alignItems: 'center',
                        justifyContent: 'right',
                      }}
                    >
                      <AvatarGroup max={20}>
                        {data.contributors.map(contrib =>
                          contrib.epics.map(data => (
                            <>
                              {detail._id == data ? (
                                <Tooltip title={contrib.name}>
                                  <Avatar
                                    {...StringAvatar(contrib.name, 'small')}
                                  />
                                </Tooltip>
                              ) : null}
                            </>
                          )),
                        )}
                      </AvatarGroup>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                      <EpicMenu
                        handleEditEpic={handleEditEpic}
                        epicId={detail._id}
                        totalStories={detail.stories?.length}
                        handleAddStory={handleAddStory}
                        role={permission}
                      />
                    </Box>
                  </Stack>
                </Card>
                <Div>&nbsp;</Div>
              </Box>
            ))}
            {permission !== 'contributor' ? (
              <Box sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  spacing={2}
                  columns={{ xs: 12, sm: 12, md: 12 }}
                >
                  <Grid xs={12} sm={12} md={5}>
                    <Item>
                      <TableContainer component="div">
                        <Table aria-label="simple table">
                          <TableHead></TableHead>
                          <TableBody>
                            <TableRow
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <Typography color="secondary">
                                  Total Estimated Hours:
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography color="secondary">
                                  {data.total_estimated_hours}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <Typography color="secondary">
                                  Estimated Completion:
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography color="secondary">
                                  {data.estimated_completion_date}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <Typography color="secondary">
                                  Setup:
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography color="secondary">
                                  {stringToCurrency(data.setup)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <Typography color="secondary">
                                  Total Price:
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography color="secondary">
                                  {stringToCurrency(data.price)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Item>
                  </Grid>
                  <Grid xs={12} sm={12} md={7}>
                    {!data.accepted_terms ? (
                      <Item>
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
                      </Item>
                    ) : (
                      <Item>
                        <TabNaviation
                          payment_history={data.payment_history}
                          paymentCurrentInstallment={
                            data.payment_current_installment
                          }
                          paymentSchedule={data.payment_schedule}
                          handlePayment={handlePayment}
                          projectBalance={Math.floor(data.project_balance)}
                        />
                      </Item>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ) : null}
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
          aria-describedby="modal-modal-description"
        >
          <ModalStyle>
            <Typography id="modal-modal-title" variant="h6" component={H2}>
              Proceed to Checkout
            </Typography>
            {paymentFormLoading && <LoadingIndicator strokeColor={'#ffffff'} />}
            <div className="App">
              {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm
                    docId={data.docId}
                    paymentCurrentInstallment={data.payment_current_installment}
                    paymentSchedule={data.payment_schedule}
                  />
                </Elements>
              )}
            </div>
          </ModalStyle>
        </Modal>
        <EpicEditModal ref={epicEditRef} />
        <StoryEditModal ref={storyEditRef} />
        <InviteModal ref={inviteRef} />
        <ContributorsModal handleInvite={handleInvite} ref={contributorsRef} />
      </ThemeProvider>

      <SaveCurrentRoute />
    </>
  );
}

const Item = styled(Paper)(({ theme }) => ({
  //backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  marginLeft: theme.spacing(2),
  marginBottom: theme.spacing(2),
  color: theme.palette.secondary.main,
}));

const A = styled('a')(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const H2 = styled('h2')(({ theme }) => ({
  color: theme.palette.primary,
}));

const DepositStyle = styled(Paper)(({ theme }) => ({
  ...theme.typography.h6,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));

const ModalStyle = styled(Box)(({ theme }) => ({
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: theme.palette.background.default,
  border: '2px solid rgba(220,120,95,1)',
  boxShadow: 24,
  padding: 14,
  color: p => p.theme.palette.text.primary,
}));

const Div = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 400,
  fontSize: '0.875rem',
  lineHeight: 1.43,
  letterSpacing: '0.01071em',
  padding: '8px',
}));

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
