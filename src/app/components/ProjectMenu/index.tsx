/**
 *
 * EpicMenu
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import Button from '@mui/material/Button';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

interface Props {
  handleInvite: any;
  handleContributors: any;
  role: any;
  id: any;
}

export function ProjectMenu({
  handleInvite,
  handleContributors,
  role,
  id,
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let navigate = useNavigate();

  const handleEdit = () => {
    navigate('/admin/proposal/' + id + '/edit');
    setAnchorEl(null);
  };

  const _handleInvite = () => {
    handleInvite();
    setAnchorEl(null);
  };
  const _handleContributors = () => {
    handleContributors();
    setAnchorEl(null);
  };

  const _handleEdit = () => {
    handleEdit();
    setAnchorEl(null);
  };

  return (
    <div>
      {role === 'owner' ? (
        <IconButton
          id="fade-button"
          color="primary"
          aria-controls={open ? 'fade-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MoreIcon color="primary" />
        </IconButton>
      ) : null}
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={_handleInvite}>Invite Contributor</MenuItem>
        <MenuItem onClick={_handleContributors}>Manage Contributors</MenuItem>
        <MenuItem onClick={_handleEdit}>Edit Proposal</MenuItem>
      </Menu>
    </div>
  );
}

//(<MenuItem onClick={navigate('/admin/proposal/' + id + '/edit')}>Edit Proposal</MenuItem>
