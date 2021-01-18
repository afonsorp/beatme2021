/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import {
  BrowserView,
  MobileView,
} from 'react-device-detect';
import { useAuth } from '../common/authProvider/authProvider.useAuth';
import { useServer } from '../common/serverProvider/serverProvider.useServer';
import Login from '../pages/login';
import NoPlayer from '../pages/noPlayer';
// import Playlist from '../pages/playlist';
import NotFound from '../common/notFound/404';
import LoadingComponent from '../common/loader/loading';
import Settings from '../pages/settings';
import { BASE_ROUTES } from '../common/authProvider/authProvider.provider';

const getComponent = ({
  server, user, children,
}) => {
  if (!server && !user) {
    return (
      <>
        <MobileView><NoPlayer /></MobileView>
        <BrowserView><Login isPlayer /></BrowserView>
      </>
    );
  }
  if (!server && user && user.isAdmin) {
    return (
      <>
        <MobileView><NoPlayer /></MobileView>
        {user.details.needsConfiguration
          ? <BrowserView><Settings /></BrowserView> : <BrowserView>{children}</BrowserView>}
      </>
    );
  }
  if (!server) {
    return <NoPlayer />;
  }
  return <Login />;
};

const PrivateRoute = ({ children, ...rest }) => {
  const { user, loadingUser } = useAuth();
  const { server, serverLoading } = useServer();
  if (serverLoading || loadingUser) return <LoadingComponent />;
  const needsRedirect = !loadingUser && !serverLoading && (!user || !server);
  const component = getComponent({
    server, user, children,
  });
  return (
    <Route
      {...rest}
      render={() => (!needsRedirect
        ? children
        : component)}
    />
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const BeatmeRouter = () => {
  const { authRoutes } = useAuth();
  return (
    <>
      <Switch>
        {BASE_ROUTES.map((route) => (
          <PrivateRoute exact path={route.path} key={route.path}>
            <div className="o-beatme__app">
              {route.component}
            </div>
          </PrivateRoute>
        ))}
        {authRoutes.map((route) => (
          <PrivateRoute exact path={route.path} key={route.path}>
            <div className="o-beatme__app">
              {route.component}
            </div>
          </PrivateRoute>
        ))}
        <PrivateRoute>
          <div className="o-beatme__app">
            <NotFound />
          </div>
        </PrivateRoute>
      </Switch>
    </>
  );
};
export default BeatmeRouter;
