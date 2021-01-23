import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { FirebaseProvider } from '../common/firebaseProvider/firebaseProvider.provider';
import { ServerProvider } from '../common/serverProvider/serverProvider.provider';
import { AuthProvider } from '../common/authProvider/authProvider.provider';
import { SpotifyProvider } from '../common/spotifyProvider/spotifyProvider.provider';
import { ActionsProvider } from '../common/actionsProvider/actionsProvider.provider';
import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

import BeatmeRouter from './router';

export default function BasicExample() {
  return (
    <FirebaseProvider>
      <Router>
        <ServerProvider>
          <SpotifyProvider>
            <AuthProvider>
              <ActionsProvider>
                <BeatmeRouter />
                <ToastContainer autoClose={1000000000000} />
              </ActionsProvider>
            </AuthProvider>
          </SpotifyProvider>
        </ServerProvider>
      </Router>
    </FirebaseProvider>
  );
}
