/**
 *
 * LoginForm
 *
 */
import React, { SyntheticEvent, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import { FormLabel } from 'app/components/FormLabel';
import { Input } from 'app/components/Input';
import { FieldSet } from 'app/components/FieldSet';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { TextButton } from 'app/components/TextButton';
import {
  selectLoading,
  selectLogin,
} from 'app/components/LoginForm/slice/selectors';
import { useLoginSlice } from 'app/components/LoginForm/slice';
import { useNavigate } from 'react-router-dom';
import { A } from '../A';

import {
  initialState,
  useInvitedSlice,
} from 'app/components/ProjectDetail/slice';
import { selectInvited } from 'app/components/ProjectDetail/slice/selectors';

import { useSelector, useDispatch } from 'react-redux';
import { formatToISO } from 'utils/firestoreDateUtil';

interface Props {}

export function RegisterForm(props: Props) {
  const { actions } = useLoginSlice();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const registerData = useSelector(selectLogin);

  const isLoading = useSelector(selectLoading);

  const project_data = useSelector(selectInvited);

  if (
    registerData.currentUser.uid > '' &&
    registerData.currentUser.role == 'user'
  ) {
    navigate('/');
  } else if (
    registerData.currentUser.uid > '' &&
    registerData.currentUser.role == 'admin'
  ) {
    navigate('/admin');
  }

  const onSubmitForm = (evt?: SyntheticEvent<HTMLFormElement>) => {
    if (evt !== undefined && evt.preventDefault) {
      const hasErrors = Object.values(errorFields).flat().length > 0;
      if (hasErrors) {
        evt.preventDefault();
        return;
      }
      dispatch(actions.registerUserLoad(true));

      evt.preventDefault();
    }
  };

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  useEffectOnMount(() => {
    //const inputs = document.getElementById("cpassword").value;
    if (Object.keys(project_data.proposal).length > 0) {
      const invited_data = {
        invite_docId: project_data.proposal.project_invited_docId,
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

  const cpassword = useRef(null);

  const VALIDATION = {
    name: [
      {
        isValid: value => !!value,
        message: '',
      },
    ],
    company: [
      {
        isValid: value => !!value,
        message: '',
      },
    ],
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
      {
        isValid: value => {
          const regex = new RegExp(registerData.cpassword);
          return regex.test(value);
        },
        message: '- Password does not match',
      },
      {
        isValid: value => /^.{8,16}$/.test(value),
        message: '- Password must be between 8-16 characters',
      },
      {
        isValid: value => /[A-Z]/.test(value),
        message: '- Password must contain at least 1 uppercase character',
      },
    ],
    cpassword: [
      {
        isValid: value => !!value,
        message: '',
      },
      {
        isValid: value => {
          const regex = new RegExp(registerData.password);
          return regex.test(value);
        },
        message: '- Password does not match',
      },
    ],
  };

  const getErrorFields = items =>
    Object.keys(registerData).reduce((acc, key) => {
      if (!VALIDATION[key]) return acc;

      const errorsPerField = VALIDATION[key]
        // get a list of potential errors for each field
        // by running through all the checks
        .map(validation => ({
          isValid: validation.isValid(items[key]),
          message: validation.message,
        }))
        // only keep the errors
        .filter(errorPerField => !errorPerField.isValid);
      return { ...acc, [key]: errorsPerField };
    }, {});

  const handleChange = event => {
    const item = {
      value: event.target.value,
      field: event.target.name,
    };

    dispatch(actions.registerUser(item));

    //console.log(cpassword.current);
  };

  const errorFields = getErrorFields(registerData);

  return (
    <>
      <FormGroup id="register" onSubmit={onSubmitForm} autoComplete="off">
        <FormLabel>
          * Email{' '}
          {errorFields['email']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['email'][0].message}
            </span>
          ) : null}
        </FormLabel>
        <InputWrapper>
          <Input
            id="email"
            type="text"
            placeholder="email"
            name="email"
            onChange={handleChange}
            borderColorError={errorFields['email']?.length ? true : false}
          />
        </InputWrapper>
        <FormLabel>
          * Full Name{' '}
          {errorFields['name']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['name'][0].message}
            </span>
          ) : null}
        </FormLabel>
        <InputWrapper>
          <Input
            id="name"
            type="text"
            placeholder="name"
            name="name"
            onChange={handleChange}
            borderColorError={errorFields['name']?.length ? true : false}
          />
        </InputWrapper>
        <FormLabel>
          * Company{' '}
          {errorFields['company']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['company'][0].message}
            </span>
          ) : null}
        </FormLabel>
        <InputWrapper>
          <Input
            id="company"
            type="text"
            placeholder="Company"
            name="company"
            onChange={handleChange}
            borderColorError={errorFields['company']?.length ? true : false}
          />
        </InputWrapper>
        <FormLabel>
          * Password{' '}
          {errorFields['password']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['password'][0].message}
            </span>
          ) : null}
        </FormLabel>
        <InputWrapper>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            borderColorError={errorFields['password']?.length ? true : false}
          />
        </InputWrapper>
        <FormLabel>
          * Confirm Password{' '}
          {errorFields['cpassword']?.length ? (
            <span style={{ color: 'red' }}>
              {errorFields['cpassword'][0].message}
            </span>
          ) : null}
        </FormLabel>
        <InputWrapper>
          <Input
            id="cpassword"
            type="password"
            placeholder="Confirm Password"
            name="cpassword"
            onChange={handleChange}
            ref={cpassword}
            borderColorError={errorFields['cpassword']?.length ? true : false}
          />
        </InputWrapper>
        <Div>
          <TextButton>Register</TextButton>
          {isLoading && <LoadingIndicator small />}
          <span>| </span>
          <A onClick={() => navigate('/login')}>Back to login</A>
        </Div>
        {registerData.error ? (
          <span style={{ color: 'red' }}>
            {registerData.error == 'Firebase: Error (auth/wrong-password).'
              ? 'You have already registered'
              : registerData.error}
          </span>
        ) : null}
      </FormGroup>
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
`;

const Div = styled.div`
  color: ${p => p.theme.text};
  ${TextButton} {
    width: ${100 / 3}%;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;
