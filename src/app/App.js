import React from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { FirebaseProvider } from '../common/firebaseProvider/firebaseProvider.provider';
import './App.scss';
import { ServerProvider } from '../common/serverProvider/serverProvider.provider';
import { AuthProvider } from '../common/authProvider/authProvider.provider';
import BeatmeRouter from './router';

export default function BasicExample() {
  return (
    <FirebaseProvider>
      <Router>
        <ServerProvider>
          <AuthProvider>
            <BeatmeRouter />
          </AuthProvider>
        </ServerProvider>
      </Router>
    </FirebaseProvider>
  );
}
