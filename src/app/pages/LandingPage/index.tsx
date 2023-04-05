/**
 *
 * LandingPage
 *
 */
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import {
  initialState,
  useProposalListSlice,
} from 'app/components/Proposal/view/list/ProposalList/slice';
import {
  selectProposalList,
  selectLoading,
} from 'app/components/Proposal/view/list/ProposalList/slice/selectors';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { PageWrapper } from 'app/components/PageWrapper';
import { ProposalItem } from 'app/components/Proposal/view/item/ProposalItem';
import { SaveCurrentRoute } from 'app/components/SaveCurrentRoute';

interface Props {}

export function LandingPage(props: Props) {
  const { actions } = useProposalListSlice();
  const dispatch = useDispatch();

  const data = useSelector(selectProposalList);
  const isLoading = useSelector(selectLoading);

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  useEffectOnMount(() => {
    dispatch(actions.getProposalList());
  });

  return (
    <PageWrapper>
      {isLoading && <LoadingIndicator />}
      {data.map((item, index) => (
        <ProposalItem
          key={index}
          name={item.name}
          status={item.status}
          price={item.price}
          createdOn={item.createdOn}
          id={item.id}
        />
      ))}

      {data?.length == 0 ? <Div>No Active Proposals Available</Div> : null}
      <SaveCurrentRoute />
    </PageWrapper>
  );
}

const Div = styled.div`
  color: ${p => p.theme.text};
`;
