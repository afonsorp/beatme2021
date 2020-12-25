import React, {
  useMemo, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import AuthContext from './authProvider.context';
import { useFirebase } from '../firebaseProvider/firebaseProvider.useFirebase';

export const AuthProvider = ({ children }) => {
  const { auth } = useFirebase();
  const [loadingUser, setLoadingUser] = useState(false);
  const [user, setUser] = useState();

  const value = useMemo(
    () => ({
      loadingUser,
      user,
    }),
    [
      loadingUser,
      user],
  );

  useEffect(() => {
    if (!auth) return;
    setLoadingUser(true);
    setTimeout(() => {
      setLoadingUser(false);
      setUser(false);
    }, 2000);
  }, [auth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
