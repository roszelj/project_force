/**
 *
 * ProposalItem
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { A } from 'app/components/A';
import { useNavigate } from 'react-router-dom';
import { ISOtoLocaleString } from 'utils/firestoreDateUtil';

interface Props {
  name: string;
  createdOn: string;
  status: string;
  price?: number;
  id: string;
}

//

export function ProposalItem({ name, createdOn, id, price, status }: Props) {
  let navigate = useNavigate();

  const handleClick = evt => {
    navigate('proposal/' + evt.target.id);
  };

  return (
    <Wrapper>
      <Name>
        <A id={id} onClick={handleClick}>
          {name}
        </A>
      </Name>
      <Status>{status}</Status>
      {price ? <Price>${price}</Price> : ''}
      <Date>{ISOtoLocaleString(createdOn)}</Date>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  min-height: 2.75rem;
  font-weight: 500;
  color: ${p => p.theme.text};

  &:nth-child(odd) {
    background-color: ${p => p.theme.backgroundVariant};
  }
`;

const Name = styled.div`
  flex: 1;
  padding: 0.625rem 0.5rem;
`;

const Price = styled.div`
  flex: 1;
  padding: 0.625rem 0;
  text-align: center;
`;

const Status = styled.div`
  flex: 1;
  padding: 0.625rem 0;
  text-align: center;
`;

const Date = styled.div`
  flex: 1;
  padding: 0.625rem 0;
  text-align: right;
  white-space: nowrap;
`;

const Div = styled.div``;
