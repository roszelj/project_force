/**
 *
 * ProjectStartCost
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';

import { selectProposalDetail } from 'app/components/Proposal/view/item/ProposalItemDetail/slice/selectors';
import { stringToCurrency } from 'utils/currencyFormat';

interface Props {}

export function ProjectStartCost(props: Props) {
  const data = useSelector(selectProposalDetail);

  return (
    <Div>
      {data.deposit > 0 ? (
        <Div>
          <h5>This project requires a deposit to proceed.</h5>
          <Box>{stringToCurrency(data.deposit)}</Box>
        </Div>
      ) : null}
      {data.payment_schedule == 100 ? (
        <Div>
          <h5>This project requires a payment in full to start.</h5>
          <Box>{stringToCurrency(data.price)}</Box>
        </Div>
      ) : null}
      {data.payment_schedule == '50/2' ? (
        <Div>
          <h5>This project requires 50% up front to start.</h5>
          <Box>{stringToCurrency(data.price / 2)}</Box>
        </Div>
      ) : null}
      {data.payment_schedule == '33/3' ? (
        <Div>
          <h5>This project requires 1/3 up front to start.</h5>
          <Box>{stringToCurrency(data.price / 3)}</Box>
        </Div>
      ) : null}
      {data.payment_schedule == '25/4' ? (
        <Div>
          <h5>This project requires 25% up front to start.</h5>
          <Box>{stringToCurrency(data.price / 4)}</Box>
        </Div>
      ) : null}
    </Div>
  );
}
5;

const Div = styled.div`
  color: ${p => p.theme.text};
`;

const Box = styled.div`
  color: ${p => p.theme.text};
  background-color: rgb(18, 18, 18);
  box-shadow: rgb(0 0 0 / 20%) 0px 3px 5px -1px,
    rgb(0 0 0 / 14%) 0px 6px 10px 0px, rgb(0 0 0 / 12%) 0px 1px 18px;
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 60px;
  letter-spacing: 0.0075em;
  text-align: center;
  height: 60px;
  background-image: linear-gradient(
    rgba(255, 255, 255, 0.11),
    rgba(255, 255, 255, 0.11)
  );
`;
