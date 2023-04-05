/**
 *
 * ProposalList
 *
 */
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, useProposalListSlice } from './slice';
import { selectProposalList, selectLoading } from './slice/selectors';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { PageWrapper } from 'app/components/PageWrapper';
import { ProposalItem } from '../../item/ProposalItem';

interface Props {}

export function ProposalList(props: Props) {
  const { actions } = useProposalListSlice();
  const dispatch = useDispatch();

  const data = useSelector(selectProposalList);
  const isLoading = useSelector(selectLoading);

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  useEffectOnMount(() => {
    // When initial state username is not null, submit the form to load repos

    dispatch(actions.getProposalList());
  });

  return (
    <PageWrapper>
      {isLoading && <LoadingIndicator />}
      {Object.values(data).flat().length == 0 ? (
        <Div>No Active Proposals</Div>
      ) : null}
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
    </PageWrapper>
  );
}
const Div = styled.div`
  color: ${p => p.theme.text};
`;
