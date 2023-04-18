/**
 *
 * EpicEditModal
 *
 */
import * as React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { useTheme, ThemeProvider, styled } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useProposalDetailSlice } from 'app/components/Proposal/view/item/ProposalItemDetail/slice';

interface Props {}

//forwardRef((props, ref)
export const EpicEditModal = React.forwardRef((props: Props, ref: any) => {
  const {
    register,
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const initialState = {
    item_title: '',
    description: '',
    item_estimation: '',
    status: '',
    _id: '',
  };

  const [epicEditOpen, setEpicEditOpen] = React.useState(false);
  const [epic, setEpic] = React.useState(initialState);

  const { actions } = useProposalDetailSlice();

  const dispatch = useDispatch();

  React.useImperativeHandle(ref, () => ({
    openModal(epicData) {
      setEpic(epicData);
      setEpicEditOpen(true);
    },
  }));

  const handleClose = () => {
    setEpicEditOpen(false);
    reset();
  };

  const theme = useTheme();

  const clickHandler = () => {
    return false;
  };

  const status = [
    {
      value: 'open',
      label: 'Open',
    },
    {
      value: 'in progress',
      label: 'In Progress',
    },
    {
      value: 'completed',
      label: 'Completed',
    },
    {
      value: 'de-scoped',
      label: 'De-Scoped',
    },
    {
      value: 'ready for acceptance',
      label: 'Ready for Acceptance',
    },
    {
      value: 'blocked',
      label: 'Blocked',
    },
    {
      value: 'on hold',
      label: 'On Hold',
    },
    {
      value: 'pending',
      label: 'Pending',
    },
  ];

  const onSubmit = data => {
    const hasErrors = Object.values(errors).flat().length > 0;
    if (!hasErrors) {
      const new_item = {
        _id: epic._id,
        item_title: data.item_title,
        description: data.description,
        item_estimation: data.item_estimation,
        status: data.status,
      };

      dispatch(actions.updateProjectItem(new_item));
      handleClose();
    }
  };

  return (
    <Modal
      open={epicEditOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalStyle>
        <Typography id="modal-modal-title" variant="h6" component={H2}>
          Edit Epic
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
              id="item_title"
              label="Title"
              variant="outlined"
              defaultValue={epic.item_title}
              required={true}
              helperText={errors.item_title ? 'Provide Title.' : ''}
              {...register('item_title', { required: true })}
              error={errors.item_title ? true : false}
            />

            <TextField
              label="Description"
              multiline
              rows={4}
              defaultValue={epic.description}
              variant="outlined"
              required={true}
              helperText={errors.description ? 'Provide Description.' : ''}
              {...register('description', { required: true })}
              error={errors.description ? true : false}
            />

            <TextField
              select
              label="Status"
              variant="outlined"
              required={true}
              defaultValue={epic.status}
              {...register('status', { required: true })}
            >
              {status.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Time Estimate"
              defaultValue={epic.item_estimation}
              variant="outlined"
              required={true}
              helperText={errors.item_estimation ? 'Provide Estimation.' : ''}
              {...register('item_estimation', { required: true })}
              error={errors.item_estimation ? true : false}
            />

            <Box
              display="flex"
              m={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button variant="contained" size="large" type="submit">
                Save
              </Button>
            </Box>
          </div>
        </Box>
      </ModalStyle>
    </Modal>
  );
});

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
