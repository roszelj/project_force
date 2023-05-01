/**
 *
 * LoginForm
 *
 */
import React, { SyntheticEvent, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { FormLabel } from 'app/components/FormLabel';
import { Input } from 'app/components/Input';
import { FieldSet } from 'app/components/FieldSet';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { TextButton } from 'app/components/TextButton';
import { formatToISO } from 'utils/firestoreDateUtil';
import {
  selectLoading,
  selectLogin,
} from 'app/components/LoginForm/slice/selectors';
import { useLoginSlice } from './slice';
import { useNavigate, useLocation } from 'react-router-dom';
import { A } from '../A';
import { selectInvited } from 'app/components/ProjectDetail/slice/selectors';

import { useSelector, useDispatch } from 'react-redux';

interface Props {}

export function LoginForm(props: Props) {
  const { actions } = useLoginSlice();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const [forgotPassword, setForgotPassword] = useState(false);

  const loginData = useSelector(selectLogin);

  const isLoading = useSelector(selectLoading);

  const project_data = useSelector(selectInvited);

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  useEffectOnMount(() => {
    //dispatch(actions.resetLogin());
    if (Object.keys(project_data.proposal).length > 0) {
      const invited_data = {
        invited_docId: project_data.proposal.project_invited_docId,
        project_docId: project_data.proposal.project_docId,
        type: project_data.proposal.project_invited_type,
        inviter_name: project_data.proposal.project_inviter.name,
        project_title: project_data.proposal.project_title,
        project_status: 'accepted_invite',
        accepted_on: formatToISO(),
      };
      dispatch(actions.registerUserInvited(invited_data));
    }
  });

  // Get redirect location or provide fallback
  const location: any = useLocation();
  if (loginData.currentUser.uid > '' && loginData.currentUser.role == 'user') {
    if (!!loginData.currentUser.redirect) {
      navigate(loginData.currentUser.redirect);
    } else if (location.state?.from > '') {
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } else {
      navigate('/');
    }
  } else if (
    (loginData.currentUser.uid > '' && loginData.currentUser.role == 'sa') ||
    (loginData.currentUser.uid > '' && loginData.currentUser.role == 'admin')
  ) {
    if (!!loginData.currentUser.redirect) {
      navigate(loginData.currentUser.redirect);
    } else if (location.state?.from > '') {
      const from = location.state?.from || '/admin';
      navigate(from, { replace: true });
    } else {
      navigate('/admin');
    }
  }

  const handleForgotPassword = () => {
    setForgotPassword(true);
  };

  const requestPasswordReset = event => {
    event.preventDefault();
    if (event.currentTarget.emailReset.value > '') {
      dispatch(actions.forgotPassword(event.currentTarget.emailReset.value));
    }
  };

  const onSubmitForm = (evt?: SyntheticEvent<HTMLFormElement>) => {
    if (evt !== undefined && evt.preventDefault) {
      if (!evt.currentTarget.email.value && !evt.currentTarget.password.value) {
        evt.preventDefault();
        return;
      }

      dispatch(
        actions.loginUser({
          email: evt.currentTarget.email.value,
          password: evt.currentTarget.password.value,
        }),
      );

      evt.preventDefault();
    }
  };

  const VALIDATION = {
    email: [
      {
        isValid: value => !!value,
        message: '',
      },
      {
        isValid: value => /\S+@\S+\.\S+/.test(value),
        message: ' - Needs to be a valid email',
      },
    ],
    password: [
      {
        isValid: value => !!value,
        message: '',
      },
    ],
  };

  return (
    <>
      <FormGroup id="login" onSubmit={onSubmitForm} autoComplete="off">
        <FormLabel>Email</FormLabel>
        <InputWrapper>
          <Input id="email" type="text" placeholder="" name="email" />
        </InputWrapper>
        <FormLabel>Password</FormLabel>
        <InputWrapper>
          <Input id="password" type="password" placeholder="" name="password" />
        </InputWrapper>
        <Div>
          <TextButton>Login</TextButton>
          {isLoading && <LoadingIndicator small />}
          <span>| </span>
          <A onClick={() => navigate('/register')}>Register</A>
        </Div>
        {loginData.error ? (
          <span style={{ color: 'red' }}>{loginData.error}</span>
        ) : null}
        <span>
          <A onClick={handleForgotPassword}>Forgot Password?</A>
        </span>
      </FormGroup>
      {forgotPassword && !loginData.reset ? (
        <FormGroup id="login" onSubmit={requestPasswordReset}>
          <FormLabel>Email</FormLabel>
          <InputWrapper>
            <Input
              id="emailReset"
              type="text"
              placeholder=""
              name="emailReset"
            />
          </InputWrapper>
          <TextButton>Submit</TextButton>
        </FormGroup>
      ) : null}
      {loginData.reset ? (
        <span style={{ color: 'white' }}>
          Password reset request sent to your email.
        </span>
      ) : null}
    </>
  );
}

const InputWrapper = styled.div`
  display: flex;
  align-items: center;

  ${Input} {
    width: 18rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }

  ${TextButton} {
    width: ${100 / 3}%;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

const ErrorText = styled.span`
  color: ${p => p.theme.text};
`;

const FormGroup = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  ${FormLabel} {
    margin-bottom: 0.25rem;
    margin-left: 0.125rem;
  }

  span {
    text-align: right;
    ${A} {
      size: 10px;
    }
  }
`;

const Div = styled.div`
  color: ${p => p.theme.text};
  ${TextButton} {
    width: ${100 / 3}%;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;
