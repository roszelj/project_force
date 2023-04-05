/**
 *
 * ProposalCreate
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import { ProposalForm } from 'app/components/Proposal/forms/ProposalForm';
import { SaveCurrentRoute } from 'app/components/SaveCurrentRoute';

interface Props {}

export function ProposalCreate(props: Props) {
  return (
    <>
      <Helmet>
        <title>Create New Proposal</title>
        <meta
          name="Prototype Proposal Generator"
          content="Get started build a proposal"
        />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <ProposalForm reset={true} />
        <SaveCurrentRoute />
      </PageWrapper>
    </>
  );
}

const Div = styled.div`
  color: ${p => p.theme.text};
`;
