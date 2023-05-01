/**
 *
 * EpicEditModal
 *
 */
import React, { useState, useRef } from 'react';
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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { selectLogin } from 'app/components/LoginForm/slice/selectors';

import Checkbox from '@mui/material/Checkbox';

import FormControl from '@mui/material/FormControl';
import { useTheme, ThemeProvider, styled } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useProposalDetailSlice } from 'app/components/Proposal/view/item/ProposalItemDetail/slice';
import { selectProposalDetail } from '../Proposal/view/item/ProposalItemDetail/slice/selectors';
import { formatToISO } from 'utils/firestoreDateUtil';

interface Props {}

export const InviteModal = React.forwardRef((props: Props, ref: any) => {
  const loginData = useSelector(selectLogin);
  const data = useSelector(selectProposalDetail);

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

  const initialState = {
    type: '',
    email: '',
    epics: [],
    project_docId: '',
    status: 'invited',
    intro: '',
    inviter: {
      name: loginData.profile.name,
      avatar: loginData.profile.avatar,
    },
    created_on: '',
  };

  const [inviteOpen, setInviteOpen] = React.useState(false);

  const [personName, setPersonName] = React.useState<string[]>([]);

  const [invite, setInvite] = React.useState<any>(initialState);

  const [emailError, setEmailError] = React.useState(
    'Please provide a valid email',
  );

  const { actions } = useProposalDetailSlice();

  const dispatch = useDispatch();

  React.useImperativeHandle(ref, () => ({
    openModal() {
      setInviteOpen(true);

      setInvite(p => {
        return {
          ...p,
          project_docId: data.docId,
        };
      });
    },
  }));

  const userInvitedCheck = value => {
    const f: any = data.invited_contributors.find(ele => ele.email === value);

    if (f) {
      setError('email', { message: 'Email already received invite' });
      setEmailError('Email already received invite');
      return false;
    } else {
      return true;
    }
  };

  const handleClose = () => {
    setInviteOpen(false);
    setInvite(initialState);
    reset();
  };

  const theme = useTheme();

  const onSubmit = items => {
    const hasErrors = Object.values(errors).flat().length > 0;

    if (!hasErrors) {
      dispatch(actions.inviteToProject(invite));
      handleClose();
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event: SelectChangeEvent<typeof invite.epics>) => {
    const {
      target: { value },
    } = event;

    /*
  setInvite(
    // On autofill we get a stringified value.
    typeof value === 'string' ? value.split(',') : value,
   
  );*/

    setInvite(p => {
      return {
        ...p,
        epics: value,
      };
    });
  };

  const handleInviteChange = event => {
    const item = {
      value: event.target.value,
      field: event.target.name,
    };

    setInvite(p => {
      return {
        ...p,
        [item.field]: item.value,
      };
    });
  };

  return (
    <Modal
      open={inviteOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalStyle>
        <Typography
          id="modal-modal-title"
          variant="h6"
          color="primary"
          component={H2}
        >
          Invite
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            '& .MuiTextField-root': { m: 1, width: '35ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              defaultValue={invite.email}
              type="email"
              required={true}
              helperText={errors.email ? emailError : ''}
              {...register('email', {
                required: true,
                pattern: /\S+@\S+\.\S+/,
                validate: value => userInvitedCheck(value), //value !== "bill",
                onChange: e => {
                  handleInviteChange(e);
                },
              })}
              error={!!errors.email}
            />
            <TextField
              id="fullname"
              label="Full Name"
              variant="outlined"
              required={true}
              helperText={errors.fullname ? 'Provide a full name' : ''}
              {...register('fullname', {
                required: true,
                onChange: e => {
                  handleInviteChange(e);
                },
              })}
              error={!!errors.fullname}
            />
            <TextField
              label="Introduction"
              multiline
              rows={4}
              variant="outlined"
              required={true}
              helperText={errors.intro ? 'Provide Intro' : ''}
              {...register('intro', {
                required: true,
                onChange: e => {
                  handleInviteChange(e);
                },
              })}
              error={errors.intro ? true : false}
            />

            <FormLabel id="demo-radio-buttons-group-label">
              Invite to Project as:
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="type"
              onChange={handleInviteChange}
            >
              <FormControlLabel
                value="contributor"
                control={<Radio />}
                label="Contributor"
                sx={{ color: theme.palette.text.secondary }}
              />
              <FormControlLabel
                value="admin"
                control={<Radio />}
                label="Project Admin"
                sx={{ color: theme.palette.text.secondary }}
              />
              <FormControlLabel
                value="client"
                control={<Radio />}
                label="Client"
                sx={{ color: theme.palette.text.secondary }}
              />
            </RadioGroup>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="epics"
              multiple
              value={invite.epics}
              input={<OutlinedInput color="primary" label="Epics" />}
              renderValue={selected => 'Select Epics'}
              displayEmpty={true}
              MenuProps={MenuProps}
              sx={{ color: theme.palette.text.secondary }}
              {...register('epics', {
                onChange: e => {
                  handleChange(e);
                },
              })}
              error={errors.epics ? true : false}
            >
              {data.project_items.map((item, index) => (
                <MenuItem
                  key={index}
                  value={item._id}
                  sx={{ color: theme.palette.text.secondary }}
                >
                  <Checkbox checked={invite.epics.indexOf(item._id) > -1} />
                  <ListItemText
                    sx={{ color: theme.palette.text.secondary }}
                    primary={item.item_title}
                  />
                </MenuItem>
              ))}
            </Select>

            <Box
              display="flex"
              m={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button variant="contained" size="large" type="submit">
                Invite
              </Button>
            </Box>
          </div>
        </Box>
      </ModalStyle>
    </Modal>
  );
});

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

const H2 = styled('h2')(({ theme }) => ({
  color: theme.palette.primary,
}));
