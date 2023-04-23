/**
 *
 * ProjectInviteLanding
 *
 */
import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from 'app/components/PageWrapper';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { ProjectDetail } from 'app/components/ProjectDetail';

interface Props {}

export function ProjectInviteLanding(props: Props) {
  let { id } = useParams();
  let { email } = useParams();

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

  return (
    <>
      <Helmet>
        <title>Project Invite</title>
        <meta
          name="Prototype Proposal Generator"
          content="Get started build a proposal"
        />
      </Helmet>

      <PageWrapper>
        <ThemeProvider theme={darkTheme}>
          <ProjectDetail id={id} email={email} />
        </ThemeProvider>
      </PageWrapper>
    </>
  );
}
