/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { useAuth } from '../common/authProvider/authProvider.useAuth';
import { useServer } from '../common/serverProvider/serverProvider.useServer';
import Login from '../pages/login';
import NoPlayer from '../pages/noPlayer';
import Playlist from '../pages/playlist';
import NotFound from '../common/notFound/404';
import LoadingComponent from '../common/loader/loading';

const PrivateRoute = ({ children, ...rest }) => {
  const { user, loadingUser } = useAuth();
  const { server, serverLoading } = useServer();
  if (serverLoading || loadingUser) return <LoadingComponent />;

  const needsRedirect = !loadingUser && !serverLoading && (!user || !server);
  const component = !server ? <NoPlayer /> : <Login />;
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

const BeatmeRouter = () => (
  <Switch>
    <PrivateRoute exact path="/login">
      <Login />
    </PrivateRoute>
    <PrivateRoute exact path="/">
      <Playlist />
    </PrivateRoute>
    <PrivateRoute exact path="/playlist">
      <Playlist />
    </PrivateRoute>
    <Route component={NotFound} />
    {/* <PrivateRoute path="/no_player">
      <NoPlayer />
    </PrivateRoute> */}
  </Switch>
);
export default BeatmeRouter;
