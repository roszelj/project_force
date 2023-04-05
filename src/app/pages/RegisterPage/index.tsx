//@ts-nocheck

import * as React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'app/components/Link';
import { NavBar } from 'app/components/NavBar';
import { Helmet } from 'react-helmet-async';
import { StyleConstants } from 'styles/StyleConstants';
import { RegisterForm } from 'app/components/RegisterForm';
import { SaveCurrentRoute } from 'app/components/SaveCurrentRoute';

export function RegisterPage() {
  return (
    <>
      <Helmet>
        <title>Register</title>
        <meta name="Register to view proposal" content="Register" />
      </Helmet>
      <Wrapper>
        <RegisterForm />
        <SaveCurrentRoute />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  height: calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT});
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 320px;
`;

const Title = styled.div`
  margin-top: -8vh;
  font-weight: bold;
  color: ${p => p.theme.text};
  font-size: 3.375rem;

  span {
    font-size: 3.125rem;
  }
`;
