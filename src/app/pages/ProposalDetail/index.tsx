/**
 *
 * ProposalDetail
 *
 */
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components/macro';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import { TextButton } from 'app/components/TextButton';
import { ProposalItemDetail } from 'app/components/Proposal/view/item/ProposalItemDetail';


interface Props {}

export function ProposalDetail(props: Props) {
  let { id } = useParams();
  //let navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Proposal - {id}</title>
        <meta
          name="Prototype Proposal Generator"
          content="Get started build a proposal"
        />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <ProposalItemDetail id={id} />

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
