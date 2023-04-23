/**
 *
 * ProjectDetail
 *
 */
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button, { ButtonProps } from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { initialState, useInvitedSlice } from './slice';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';
import Modal from '@mui/material/Modal';

import { selectInvited, selectLoading } from './slice/selectors';
import { useSelector, useDispatch } from 'react-redux';

interface Props {
  id: any;
  email: any;
}

export function ProjectDetail({ id, email }: Props) {
  const { actions } = useInvitedSlice();

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector(selectLoading);
  const project_data = useSelector(selectInvited);

  const [error, setError] = useState(false);
  const [acceptedOpen, setAcceptedOpen] = useState(false);

  const theme = useTheme();

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  useEffectOnMount(() => {
    dispatch(actions.getProposal(id));

    // Create PaymentIntent as soon as the page loads

    fetch(
      'https://us-central1-proposal-generator-f87ad.cloudfunctions.net/getProjectDetail',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { id: id, email: email } }),
      },
    )
      .then(res => res.json())
      .then(data => {
        if (data.status == 'error') {
          dispatch(actions.setLoading(false));
          setError(true);
        } else {
          console.log(data);
          dispatch(actions.loadProposal(data));
        }
      });
  });

  const handleAccept = () => {
    setAcceptedOpen(true);
  };

  const handleDecline = () => {};

  const handleClose = () => {
    setAcceptedOpen(false);
  };

  return (
    <>
      {isLoading && <LoadingIndicator strokeColor={'rgba(220,120,95,1)'} />}
      <Box>
        {error ? (
          <Alert severity="error">Unable to view project.</Alert>
        ) : (
          <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined" sx={{ padding: '6px;', marginBottom: 3 }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: 'center' }}
                >
                  <Avatar
                    alt=""
                    src={project_data.proposal.project_inviter?.avatar}
                  />

                  <Typography variant="body2" component="div" color="secondary">
                    {project_data.proposal.project_intro}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div" color="text.primary">
                  {project_data.proposal.project_title}
                </Typography>
                <Divider
                  role="presentation"
                  component="div"
                  sx={{ textAlign: 'left' }}
                >
                  <Typography variant="h6" color="rgba(220,120,95,1)">
                    Project Summary
                  </Typography>
                </Divider>

                <Typography sx={{ mb: 1.5, p: 3 }} color="text.secondary">
                  {project_data.proposal.project_summary}
                </Typography>
                <Divider
                  role="presentation"
                  component="div"
                  sx={{ textAlign: 'left' }}
                >
                  <Typography variant="h6" color="rgba(220,120,95,1)">
                    Project Details
                  </Typography>
                </Divider>
                {project_data.proposal.project_epics?.map(epic => (
                  <>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={epic.item_title}
                          secondary={
                            <React.Fragment>
                              {epic.description}
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="primary"
                              >
                                <br />
                                Time Estimate:
                              </Typography>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="secondary"
                              >
                                {' ' + epic.item_estimation}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </List>
                  </>
                ))}

                {project_data.proposal.status != 'invited' ? (
                  <Box>
                    <Alert severity="info">
                      Accepting this invite simply shows your interest in having
                      more conversation about the work needed to be done.
                    </Alert>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ justifyContent: 'center' }}
                    >
                      <ColorButton
                        variant="outlined"
                        sx={{ color: 'green' }}
                        onClick={handleAccept}
                      >
                        Accept Invite
                      </ColorButton>
                      <Button variant="outlined" color="error">
                        Decline Invite
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  <Alert severity="info">
                    Invited is has been currently accepted.
                  </Alert>
                )}
              </CardContent>
              <CardActions></CardActions>
            </Card>
          </Box>
        )}
      </Box>

      <Modal
        open={acceptedOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalStyle>
          <Typography variant="body2" color="secondary">
            Thank your for accepting the invite. Next step is to register or
            login if you have already registered.
            <br />
          </Typography>
          <Box>
            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: 'space-around' }}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Button onClick={() => navigate('/register')}>Register</Button>

              <Button>Login</Button>
            </Stack>
          </Box>
        </ModalStyle>
      </Modal>
    </>
  );
}

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  //color: theme.palette.getContrastText(purple[500]),
  //backgroundColor: purple[500],
  '&:hover': {
    // backgroundColor: purple[700],
    borderColor: 'green',
  },
  borderColor: 'green',
}));

const ModalStyle = styled(Box)(({ theme }) => ({
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 340,
  width: 'auto',
  backgroundColor: theme.palette.background.default,
  border: '2px solid rgba(220,120,95,1)',
  boxShadow: 24,
  padding: 14,
  color: p => p.theme.palette.text.primary,
}));
