import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Amplify v6 config
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-2_5diebWcgj",
      userPoolClientId: "15lpp56u9oqe7g80bl7003a1o",
      loginWith: {
        email: true,
      },
    },
  },
});

reportWebVitals();
