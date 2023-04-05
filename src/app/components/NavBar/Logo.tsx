import * as React from 'react';
import styled from 'styled-components/macro';
import { useNavigate } from 'react-router-dom';
import { A } from 'app/components/A';
import { TextButton } from '../TextButton';
import { selectLogin } from 'app/components/LoginForm/slice/selectors';
import { useSelector } from 'react-redux';

export function Logo() {
  let navigate = useNavigate();
  const loginData = useSelector(selectLogin);

  return (
    <Wrapper>
      <Title>
        <TextButton
          onClick={() => {
            loginData.currentUser.role == 'admin'
              ? navigate('/admin')
              : navigate('/');
          }}
        >
          CHANGE TO LOGO
        </TextButton>
      </Title>
      <Description></Description>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: left;

  ${TextButton} {
    width: auto;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    text-align: left;
    color: ${p => p.theme.text};
    background: none;
    text-decoration: none;
  }
`;

const Title = styled.div`
  font-size: 1.25rem;
  color: ${p => p.theme.text};
  font-weight: bold;
  margin-right: 1rem;
`;

const Description = styled.div`
  font-size: 0.875rem;
  color: ${p => p.theme.textSecondary};
  font-weight: normal;
`;
