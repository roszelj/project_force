import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { loginSaga } from './saga';
import { LoginState } from './types';
import { useSelector, useDispatch } from 'react-redux';

export const initialState: LoginState = {
  loading: false,
  password: '',
  cpassword: '',
  username: '',
  email: '',
  reset: false,
  firstLogin: false,
  company: '',
  error: '',
  profile: {},
  invited: {},
  currentUser: {},
};

const slice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    resetLogin: () => initialState,
    loginUser(state, action: PayloadAction<any>) {
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.loading = true;
    },
    loadUser(state, action: PayloadAction<any>) {
      state.currentUser = action.payload.currentUser;
      state.profile = action.payload.profile;
      state.loading = false;
    },
    refreshUser(state, action: PayloadAction<any>) {
      state.currentUser = action.payload;
      state.loading = true;
    },
    simulateUser(state) {
      {
        state.currentUser.role == 'user'
          ? (state.currentUser.role = 'admin')
          : (state.currentUser.role = 'user');
      }
    },
    registerUser(state, action: PayloadAction<any>) {
      const f = { ...state, [action.payload.field]: action.payload.value };
      return f;
    },
    registerUserLoad(state, action: PayloadAction<any>) {
      state.loading = true;
    },
    registerUserInvited(state, action: PayloadAction<any>) {
      state.invited = action.payload;
    },
    registered(state, action: PayloadAction<any>) {
      state.firstLogin = true;
      state.username = action.payload;
      state.loading = false;
    },
    authError(state, action: PayloadAction<any>) {
      state.error = action.payload;
      state.loading = false;
    },
    forgotPassword(state, action: PayloadAction<any>) {
      state.email = action.payload;
    },
    resetConfirmation(state) {
      state.reset = true;
    },
    saveCurrentRoute(state, action: PayloadAction<any>) {
      state.currentUser.redirect = action.payload;
    },
  },
});

export const { actions: loginActions } = slice;

export const useLoginSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: loginSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useLoginSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
