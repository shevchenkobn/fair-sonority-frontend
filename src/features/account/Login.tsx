import { Button, LinearProgress, Paper, TextField } from '@material-ui/core';
import { InputProps as StandardInputProps } from '@material-ui/core/Input/Input';
import React, { FormEventHandler } from 'react';
import { getEmailError } from '../../lib/forms';
import { Credentials } from './types';
import scss from '../../constants.module.scss';
import './Login.scss';

export interface LoginProps {
  onCredentialsChange(credentials: Credentials): Promise<void>;
}

export function Login({ onCredentialsChange }: LoginProps) {
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');

  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const [loading, setLoading] = React.useState(false);

  const handleEmailChange: StandardInputProps['onChange'] = (event) => {
    setEmail(event.target.value);
    setEmailError(getEmailError(event.target.value));
  };
  const handlePasswordChange: StandardInputProps['onChange'] = (event) => {
    setPassword(event.target.value);
    setPasswordError(getPasswordError(event.target.value));
  };
  const handleEmailValidation: StandardInputProps['onBlur'] = (event) => {
    setEmailError(getEmailError(event.target.value));
  };
  const handlePasswordValidation: StandardInputProps['onBlur'] = (event) => {
    setPasswordError(getPasswordError(event.target.value));
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const [emailError, passwordError] = [
      getEmailError(email),
      getPasswordError(password),
    ];
    setEmailError(emailError);
    setPasswordError(passwordError);
    if (!emailError && !passwordError) {
      setLoading(true);
      onCredentialsChange({ username: email, password }).catch(() => {
        setLoading(false);
      });
    }
  };

  return (
    <Paper className={scss.appLoginClass}>
      <LinearProgress className={loading ? '' : 'hidden'} />
      <form onSubmit={handleFormSubmit} className="form-100-m1">
        <TextField
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailValidation}
          error={!!emailError}
          disabled={loading}
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          helperText={emailError}
        />
        <TextField
          value={password}
          onChange={handlePasswordChange}
          onBlur={handlePasswordValidation}
          error={!!passwordError}
          disabled={loading}
          id="password"
          label="Password"
          type="password"
          autoComplete="password"
          helperText={passwordError}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Login
        </Button>
      </form>
    </Paper>
  );
}

function getPasswordError(password: string) {
  return password ? '' : 'Password is required';
}
