import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { withAuthentication } from './auth/withAuthentication';
import { Navigation } from './components/Navigation';
import './less/App.css';
import Router from './routes/Router';

const AppComponent: React.SFC = () => (
  <BrowserRouter>
    <div>
      <Navigation />
      <hr />
      <Router />
    </div>
  </BrowserRouter>
)

export const App = withAuthentication(AppComponent);
