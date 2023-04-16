/**
 *
 * StoryEditModal
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
export const StoryEditModal = React.forwardRef((props: Props, ref: any) => {
  const {
    register,
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const initialState = {
    epic_id: '',
    title: '',
    description: '',
    points: '',
    status: '',
    _id: '',
  };

  const [storyEditOpen, setStoryEditOpen] = React.useState(false);
  const [story, setStory] = React.useState(initialState);
  const [epicId, setEpicId] = React.useState();
  const { actions } = useProposalDetailSlice();

  const dispatch = useDispatch();

  React.useImperativeHandle(ref, () => ({
    openModal(storyData,epicId) {
      setStory(storyData);
      setEpicId(epicId);
      setStoryEditOpen(true);
    },
  }));

  const handleClose = () => {
    setStoryEditOpen(false);
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
      value: 'ready to work',
      label: 'Ready to work',
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
    {
      value: 'deployed',
      label: 'Deployed',
    },
  ];

  const onSubmit = (data) => {
    const hasErrors = Object.values(errors).flat().length > 0;
    if(!hasErrors){
      const new_item = {
        epic_id: epicId,
        _id: story._id,
        title: data.title,
        description: data.description,
        points: data.points,
        status: data.status
      };

      dispatch(actions.updateProjectItemStory(new_item));
      handleClose();
    }
  }

  return (
    <Modal
      open={storyEditOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalStyle>
        <Typography id="modal-modal-title" variant="h6" component={H2}>
          Edit Story
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
              id="title"
              label="Title"
              variant="outlined"
              defaultValue={story.title}
              required={true}
              helperText={errors.item_title ? 'Provide Title.' : ''}
              {...register('title', { required: true })}
              error={errors.title ? true : false}
            />

            <TextField
              label="Description"
              multiline
              rows={4}
              defaultValue={story.description}
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
              defaultValue={story.status}
              {...register('status', { required: true })}
            >
              {status.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Points"
              defaultValue={story.points}
              variant="outlined"
              required={true}
              helperText={errors.points ? 'Provide Points.' : ''}
              {...register('points', { required: true })}
              error={errors.points ? true : false}
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
