/**
 *
 * ProposalUpdate
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { ProposalForm } from '../forms/ProposalForm';

interface Props {
  id?: any;
}

export function ProposalUpdateForm({ id }: Props) {
  return (
    <>
      <ProposalForm id={id} />
    </>
  );
}

const Div = styled.div`
  color: ${p => p.theme.text};
`;
