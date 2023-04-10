import * as React from 'react';
import styled from 'styled-components/macro';
import { ReactComponent as DocumentationIcon } from './assets/documentation-icon.svg';
import { ReactComponent as GithubIcon } from './assets/github-icon.svg';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginSlice } from 'app/components/LoginForm/slice';

export function Nav() {
  let navigate = useNavigate();
  const { actions } = useLoginSlice();
  const dispatch = useDispatch();

  const logoutUser = () => {
    window.location.href = '/login';
    sessionStorage.clear();
  };

  return (
    <Wrapper>
      <Item
        onClick={() => navigate('/admin/create-proposal')}
        target="_blank"
        title=""
        rel="noopener noreferrer"
      >
        <DocumentationIcon />
        Create New Proposal
      </Item>
      <Item onClick={() => dispatch(actions.simulateUser())}>
        Simulate User
      </Item>
      <Item onClick={logoutUser}>Logout</Item>
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  display: flex;
  margin-right: -1rem;
`;

const Item = styled.a`
  color: ${p => p.theme.primary};
  cursor: pointer;
  text-decoration: none;
  display: flex;
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.4;
  }

  .icon {
    margin-right: 0.25rem;
  }
`;
