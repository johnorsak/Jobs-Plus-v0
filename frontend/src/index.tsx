import React from 'react';
import ReactDOM from 'react-dom/client';
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
      userPoolClientId: "dt1nel3krcmkpmm6vr8504ur",
      loginWith: { email: true },
    },
  },
});

reportWebVitals();
