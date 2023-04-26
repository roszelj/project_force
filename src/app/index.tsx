/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { HomePage } from './pages/HomePage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { ProposalCreate } from './pages/ProposalCreate';
import { ProposalDetail } from './pages/ProposalDetail';
import { useTranslation } from 'react-i18next';
import { ProposalUpdate } from './pages/ProposalUpdate';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { PaymentSuccessful } from './pages/PaymentSuccessful';
import { useLoginSlice } from 'app/components/LoginForm/slice';
import { useSelector, useDispatch } from 'react-redux';
import { selectLogin } from 'app/components/LoginForm/slice/selectors';
import { ProjectInviteLanding } from './pages/ProjectInviteLanding';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'firebase_setup/firebase';

export function App() {
  const { actions } = useLoginSlice();
  const loginData = useSelector(selectLogin);

  const dispatch = useDispatch();

  const onAuthStateChange = () => {
    useAuth.onAuthStateChanged(user => {
      if (user) {
        let currentUser: any = user.toJSON();

        if (typeof currentUser.email != 'undefined') {
          console.log('logged in');
          /*
          if (data.email == 'justin@zellebook.com') {
            data.role = 'admin';
            data.redirect = sessionStorage.getItem('last_path');
          } else {
            data.role = 'user';
          }*/

          currentUser.redirect = sessionStorage.getItem('last_path');

          dispatch(actions.refreshUser(currentUser));
        }
      } else {
        console.log('not logged');
      }
    });
  };

  useEffect(() => {
    onAuthStateChange();
  }, []);

  const ProtectedRoute = ({
    isAllowed,
    redirectPath = '/login',
    state,
    //children,
  }) => {
    const location = useLocation();

    if (!isAllowed) {
      return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    return <Outlet />;
  };

  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - Big Bright Digital"
        defaultTitle="BBD"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="Manage Proposal Workflow" />
      </Helmet>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/payment-successful" element={<PaymentSuccessful />} />
        <Route
          path="/project-invite/:id/:email"
          element={<ProjectInviteLanding />}
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute
              redirectPath="/"
              state={{ from: location }}
              isAllowed={
                /*
                !!loginData.currentUser.uid &&
                loginData.currentUser.role === 'sa' || 
                !!loginData.currentUser.uid &&
                loginData.currentUser.role === 'admin'
                */
                !!loginData.currentUser.uid
              }
            />
          }
        >
          <Route path="/admin" element={<HomePage />} />
          <Route path="/admin/create-proposal" element={<ProposalCreate />} />
          <Route path="/admin/proposal">
            <Route path=":id" element={<ProposalDetail />} />
            <Route path=":id/edit" element={<ProposalUpdate />} />
          </Route>
        </Route>
        <Route
          element={
            <ProtectedRoute
              isAllowed={!!loginData.currentUser.uid}
              state={{ from: location }}
            />
          }
        >
          <Route path="/proposal">
            <Route path=":id" element={<ProposalDetail />} />
          </Route>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <GlobalStyle />
    </BrowserRouter>
  );
}
