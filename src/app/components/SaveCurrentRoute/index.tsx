/**
 *
 * SaveCurrentRoute
 *
 */
import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
//import { useLoginSlice } from 'app/components/LoginForm/slice';
//import { useSelector, useDispatch } from 'react-redux';

interface Props {}

export function SaveCurrentRoute(props: Props) {
  //const { actions } = useLoginSlice();
  //const dispatch = useDispatch();

  const location = useLocation();
  sessionStorage.setItem('last_path', location.pathname);

  return null;
}
