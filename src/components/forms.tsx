import React from 'react';

export const addAsterisk = (label: string) => (
  <>
    {label}
    <Asterisk />
  </>
);

export function Asterisk() {
  return (
    <span
      aria-hidden="true"
      className="MuiFormLabel-asterisk MuiInputLabel-asterisk"
    >
      *
    </span>
  );
}
