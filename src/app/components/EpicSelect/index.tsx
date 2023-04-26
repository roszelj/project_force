/**
 *
 * EpicSelect
 *
 */
import * as React from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useSelector, useDispatch } from 'react-redux';
import { useProposalDetailSlice } from 'app/components/Proposal/view/item/ProposalItemDetail/slice';

import { useForm, Controller } from 'react-hook-form';

interface Props {
  projectItems: any;
  assigned: any;
  uid: any;
}

export function EpicSelect({ projectItems, assigned, uid }: Props) {
  const theme = useTheme();

  const { actions } = useProposalDetailSlice();
  const dispatch = useDispatch();

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

  const initialState = { epics: assigned, uid: uid };

  const [assignedEpics, setAssignedEpics] = React.useState<any>(initialState);

  console.log(assignedEpics);

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

  const handleChange = (
    event: SelectChangeEvent<typeof assignedEpics.epics>,
  ) => {
    const {
      target: { value },
    } = event;

    setAssignedEpics(p => {
      return {
        ...p,
        epics: value,
      };
    });

    //dispatch(actions.updartedContributorEpics(assignedEpics));
  };

  const commitChanges = e => {
    dispatch(actions.updateContributorEpics(assignedEpics));
  };
  return (
    <Select
      labelId="epics-select-label"
      id="epics_select"
      multiple
      value={assignedEpics.epics}
      input={<OutlinedInput color="primary" label="Epics" />}
      renderValue={selected => 'Select Epics'}
      displayEmpty={true}
      MenuProps={MenuProps}
      sx={{ color: theme.palette.text.secondary }}
      required={true}
      {...register('epics', {
        required: true,
        onChange: e => {
          handleChange(e);
        },
        onBlur: e => {
          commitChanges(e);
        },
      })}
      error={errors.epics ? true : false}
    >
      {projectItems.map((item, index) => (
        <MenuItem
          key={index}
          value={item._id}
          sx={{ color: theme.palette.text.secondary }}
        >
          <Checkbox checked={assignedEpics.epics.indexOf(item._id) > -1} />
          <ListItemText
            sx={{ color: theme.palette.text.secondary }}
            primary={item.item_title}
          />
        </MenuItem>
      ))}
    </Select>
  );
}
