/**
 *
 * ContributorsModal
 *
 */
import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { selectLogin } from 'app/components/LoginForm/slice/selectors';
import PersonIcon from '@mui/icons-material/Person';
import Checkbox from '@mui/material/Checkbox';

import FormControl from '@mui/material/FormControl';
import { useTheme, ThemeProvider, styled } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useProposalDetailSlice } from 'app/components/Proposal/view/item/ProposalItemDetail/slice';
import { selectProposalDetail } from '../Proposal/view/item/ProposalItemDetail/slice/selectors';
import { formatToISO } from 'utils/firestoreDateUtil';
import Stack from '@mui/material/Stack';
import { selectInvited } from '../ProjectDetail/slice/selectors';
import { EpicSelect } from '../EpicSelect';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import { StringAvatar } from 'app/components/StringAvatar';
import Avatar from '@mui/material/Avatar';
import Accordion from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
  handleInvite: any;
}

//forwardRef((props, ref)
export const ContributorsModal = React.forwardRef(
  ({ handleInvite }: Props, ref: any) => {
    const loginData = useSelector(selectLogin);

    const [openList, setOpenList] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);


    const {
      register,
      reset,
      control,
      handleSubmit,
      watch,
      setError,
      resetField,
      formState: { errors },
    } = useForm();

    const initialState = {};

    const [contributorOpen, setContributorOpen] = React.useState(false);
    const [selectedContributor, setSelectedContributor] = React.useState();


    const { actions } = useProposalDetailSlice();

    const data = useSelector(selectProposalDetail);

    const dataFiltered = data.invited_contributors.filter(
      ele => ele.status != 'approved',
    );

    const dispatch = useDispatch();

    React.useImperativeHandle(ref, () => ({
      openModal() {
        setContributorOpen(true);
      },
    }));

    const handleClose = () => {
      setContributorOpen(false);
      reset();
    };

    const handleClick = () => {
      setOpenList(!openList);
    };

    const handleContribType = (event, uid) => {
      console.log(event.target.checked);
      const item = {
        uid: uid,
        type: event.target.checked ? 'admin' : 'contributor',
      };
      dispatch(actions.updateContributorType(item));
    };

    const handleDialogOpen = (docId) => {
      setSelectedContributor(docId);
      setDialogOpen(true);
    };
  
    const handleDialogClose = () => {
      setDialogOpen(false);
    };
  
    const handleDialogYes = () => {
      handleRemoveContributor();
      setDialogOpen(false);
    };


    const handleRemoveContributor = () => {

      const contributor = data.contributors.find(e => e.docId === selectedContributor);

      const updatedContributor = {
        project_docId: data.docId,
        type: contributor.type,
        docId: contributor.docId,
        uid: contributor.uid,
        name: contributor.fullname,
        email: contributor.email,
        epics: contributor.epics,
        created_on: formatToISO(),
      };

      dispatch(actions.removeContributor(updatedContributor));



      //dispatch(actions.removeContributor(docId));
    }


    const theme = useTheme();

    return (
      <Modal
        open={contributorOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalStyle>
          <Divider
            role="presentation"
            component="div"
            sx={{ textAlign: 'left' }}
          >
            <Typography variant="h6" color="primary">
              Contributors
            </Typography>
          </Divider>
          {Object.keys(data.contributors).length === 0 ? (
            <Typography component="div" sx={{ textAlign: 'center' }}>
              No active contributors for this project.
            </Typography>
          ) : (
            <List
              sx={{ width: '100%', bgcolor: 'background.paper', padding: 0 }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              {data.contributors.map((item, index) => (
                <Box key={index}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <StackItem name={item.name} status="" invited={false} />
                    </AccordionSummary>
                    <AccordionDetails>
                      {item.type !== 'client' ? (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'baseline',
                          }}
                        >
                          <EpicSelect
                            projectItems={data.project_items}
                            assigned={item.epics}
                            uid={item.uid}
                          />

                          <FormGroup>
                            <FormControlLabel
                              sx={{ paddingLeft: 2 }}
                              control={
                                <Switch
                                  name="type"
                                  onChange={e => handleContribType(e, item.uid)}
                                  checked={item.type === 'admin' ? true : false}
                                />
                              }
                              label="Project Admin"
                            />
                          </FormGroup>
                        </Box>
                      ) : (
                        <Typography sx={{ paddingLeft: 2 }} color="secondary">
                          Client
                        </Typography>
                      )}
                      <Box sx={{display:"flex", justifyContent:"center", paddingTop:2}}>
                      <Button variant="outlined" onClick={() => handleDialogOpen(item.docId)}>
            Remove
          </Button>
                      </Box>
                      
                    </AccordionDetails>
                  </Accordion>
                </Box>
              ))}
            </List>
          )}
          <Divider
            role="presentation"
            component="div"
            sx={{ textAlign: 'left' }}
          >
            <Typography variant="h6" color="primary">
              Invited
            </Typography>
          </Divider>
          {Object.keys(dataFiltered).length === 0 ? (
            <Box>
              <Typography component="div" sx={{ textAlign: 'center' }}>
                No accepted invites for this project.
              </Typography>
              <Box
                sx={{ display: 'flex', justifyContent: 'center', padding: 1 }}
              >
                <Button variant="outlined" onClick={handleInvite}>
                  Invite
                </Button>
              </Box>
            </Box>
          ) : (
            <List
              sx={{ width: '100%', bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              {dataFiltered.map((item, index) => (
                <Box key={index}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <StackItem
                        name={item.fullname}
                        status={item.status}
                        invited={true}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <InvitedDetailsItem
                        id={item.docId}
                        projectDocId={data.docId}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Box>
              ))}
            </List>
          )}
           <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Remove?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this contributor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>No</Button>
          <Button onClick={handleDialogYes} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
        </ModalStyle>
      </Modal>
    );
  },
);

interface InvitedDetailsProps {
  id: string;
  projectDocId;
}

export function InvitedDetailsItem({ id, projectDocId }: InvitedDetailsProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { actions } = useProposalDetailSlice();

  const data = useSelector(selectProposalDetail);

  const dispatch = useDispatch();

  const selectedInvite = data.invited_contributors.find(e => e.docId === id);

  const updatedContributor = {
    project_docId: projectDocId,
    type: selectedInvite.type,
    invited_docId: selectedInvite.docId,
    uid: selectedInvite.uid,
    name: selectedInvite.fullname,
    email: selectedInvite.email,
    epics: selectedInvite.epics,
    created_on: formatToISO(),
  };

  const handleAddContributor = () => {
    dispatch(actions.addContributor(updatedContributor));
  };

  const handleRemoveInvite = () => {
    dispatch(actions.removeInvite(updatedContributor));
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogYes = () => {
    handleRemoveInvite();
    setDialogOpen(false);
  };

  return (
    <>
      {selectedInvite.status != 'invited' ? (
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
          <Box sx={{ justifyContent: 'space-evenly' }}>
            <Button variant="outlined" onClick={handleAddContributor}>
              Add as Contributor
            </Button>
            <Button variant="outlined" onClick={handleRemoveInvite}>
              Remove
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
          <Alert severity="info">
            Once the invite has been excepted you can add as a contributor
          </Alert>

          <Button variant="outlined" onClick={handleDialogOpen}>
            Remove
          </Button>
        </Box>
      )}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Remove?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>No</Button>
          <Button onClick={handleDialogYes} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

interface ItemProps {
  name: string;
  status: string;
  invited: boolean;
}
export function StackItem({ name, status, invited }: ItemProps) {
  return (
    <>
      <Stack
        direction="row"
        component="div"
        spacing={2}
        sx={{ display: 'flex', flexGrow: 1 }}
        divider={<Divider orientation="vertical" flexItem />}
      >
        {invited ? <PersonIcon /> : <Avatar {...StringAvatar(name, 'small')} />}
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'left' }}>
          <Typography sx={{ width: '100%' }}>{name}</Typography>
        </Box>
        {invited ? (
          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'right' }}>
            <Typography sx={{ textAlign: 'right', width: '100%' }}>
              {status === 'accepted_invite' ? 'Accepted' : status}
            </Typography>
          </Box>
        ) : null}
      </Stack>
    </>
  );
}

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
  color: theme.palette.text.primary,
  overflow: 'scroll',
  height: '100%',
  display: 'block',
}));

const Div = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 400,
  fontSize: '0.875rem',
  lineHeight: 1.43,
  letterSpacing: '0.01071em',
  padding: '8px',
}));

const H2 = styled('h2')(({ theme }) => ({
  color: theme.palette.primary,
}));
