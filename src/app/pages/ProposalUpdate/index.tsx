/**
 *
 * ProposalUpdate
 *
 */
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import { TextButton } from 'app/components/TextButton';
import { ProposalItemDetail } from 'app/components/Proposal/view/item/ProposalItemDetail';
import styled from 'styled-components/macro';
import { ProposalUpdateForm } from 'app/components/Proposal/update';
import { SaveCurrentRoute } from 'app/components/SaveCurrentRoute';

interface Props {}

export function ProposalUpdate(props: Props) {
  let { id } = useParams();

  return (
    <>
      <Helmet>
        <title>Proposal (Edit) - {id}</title>
        <meta
          name="Prototype Proposal Generator"
          content="Get started build a proposal"
        />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <ProposalUpdateForm id={id} />
        <SaveCurrentRoute />
      </PageWrapper>
    </>
  );
}

const Div = styled.div`
  color: ${p => p.theme.text};

  ${TextButton} {
    width: ${100 / 3}%;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;
