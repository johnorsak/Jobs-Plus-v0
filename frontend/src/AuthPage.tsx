// src/AuthPage.tsx
import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';

const AuthPage: React.FC<{ onAuthSuccess: () => void }> = ({ onAuthSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({ username: email, password });
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      setStep('confirm');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      alert('Account confirmed. Please sign in.');
      setIsSignup(false);
      setStep('form');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: 400 }}>
        <h3 className="text-center mb-4">
          {step === 'confirm'
            ? 'Confirm your account'
            : isSignup
            ? 'Create Account'
            : 'Sign In'}
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}

        {step === 'confirm' ? (
          <form onSubmit={handleConfirm}>
            <div className="mb-3">
              <label className="form-label">Verification code</label>
              <input
                type="text"
                className="form-control"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary w-100" type="submit">
              Confirm
            </button>
          </form>
        ) : (
          <form onSubmit={isSignup ? handleSignUp : handleSignIn}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary w-100" type="submit">
              {isSignup ? 'Sign Up' : 'Sign In'}
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                }}
              >
                {isSignup ? 'Already have an account? Sign In' : 'Create an account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
