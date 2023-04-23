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

interface Props {

  handleInvite:any;
}

//forwardRef((props, ref)
export const ContributorsModal = React.forwardRef(({handleInvite}: Props, ref: any) => {
  const loginData = useSelector(selectLogin);

  const [openList, setOpenList] = React.useState(false);

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

  const { actions } = useProposalDetailSlice();

  const data = useSelector(selectProposalDetail);

  const dataFiltered = data.invited_contributors.filter(ele => ele.status !== 'approved');

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
                  <Typography variant="h6" color="rgba(220,120,95,1)">
                    Contributors
                  </Typography>
                </Divider>
        {Object.keys(data.contributors).length === 0 ? (
          <Typography component="div" sx={{textAlign: "center"}}>
            No active contributors for this project.
          </Typography>
        ) : (
        <List
          sx={{ width: '100%', bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {data.contributors.map((item,index) => (
            <Box key={index}>
            <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItem alignItems="flex-start">
            <StackItem name={item.name} status="" />
            </ListItem>
            {openList ? (<ExpandLess />) : (<ExpandMore />)}
          </ListItemButton>
            <Collapse in={openList} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemText sx={{ pl: 2 }} primary="test"/>
              </List>
            </Collapse>
            
            </Box>
          ))}
        </List>
        )}
        <Divider
                  role="presentation"
                  component="div"
                  sx={{ textAlign: 'left' }}
                >
                  <Typography variant="h6" color="rgba(220,120,95,1)">
                    Invited
                  </Typography>
                </Divider>
        {Object.keys(dataFiltered).length === 0 ? (
          <Box>
          <Typography component="div" sx={{textAlign: "center"}}>
            No active invites for this project.
          </Typography>
            <Box sx={{display:"flex", justifyContent:"center", padding:1}}>
              <Button variant="outlined" onClick={handleInvite}>Invite</Button>
            </Box>
          </Box>
        ) : (
        <List
          sx={{ width: '100%', bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {data.invited_contributors.map((item,index) => (
            <Box key={index}>
            <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItem alignItems="flex-start">
            <StackItem name={item.fullname} status={item.status} />
            </ListItem>
            {openList ? (<ExpandLess />) : (<ExpandMore />)}
          </ListItemButton>
            <Collapse in={openList} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem sx={{ pl: 2 }} alignItems="flex-start">
                    <InvitedDetailsItem id={item.docId} projectDocId={data.docId}/>
                </ListItem>
                  
                
              </List>
            </Collapse>
            
            </Box>
          ))}
          
        </List>)}
      </ModalStyle>
    </Modal>
  );
});



interface InvitedDetailsProps {
  id:string;
  projectDocId
}

export function InvitedDetailsItem({id, projectDocId}: InvitedDetailsProps) {

    const { actions } = useProposalDetailSlice();

    const data = useSelector(selectProposalDetail);

    const dispatch = useDispatch();

    const handleAddContributor = () => {
        const selectedInvite = data.invited_contributors.find(e=>e.docId === id);
        const updatedContributor = {project_docId: projectDocId, invited_docId:selectedInvite.docId, uid: selectedInvite.uid, name: selectedInvite.fullname, email: selectedInvite.email, epics: selectedInvite.epics, created_on: formatToISO()}
        dispatch(actions.addContributor(updatedContributor));
    }

    return(
      <>
      <Box sx={{display:"flex",flexGrow:1, justifyContent:"center"}}>
        <Button variant="outlined" onClick={handleAddContributor}>Add as Contributor</Button>
      </Box>
      
      </>
    )
}


interface ItemProps {
  name:string;
  status:string;
}
export function StackItem({name, status}: ItemProps) {
  
  return (
      <>
      <Stack
              direction="row"
              component="div"
              spacing={2}
              sx={{ display:"flex", flexGrow: 1 }}
              divider={<Divider orientation="vertical" flexItem />}
            >
            <Box sx={{    display:"flex", flexGrow:1, justifyContent:"left"}}>
             <Typography>
                {name}
             </Typography>
             </Box>
             <Box sx={{    display:"flex", flexGrow:1, justifyContent:"right"}}>
              <Typography sx={{textAlign:"right"}} >
                  {status === "accepted_invite" ? ("Accepted") : status}
              </Typography>
             </Box>
             
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
