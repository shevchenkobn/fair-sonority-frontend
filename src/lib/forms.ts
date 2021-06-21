/**
 * @param value the value of the input
 * @returns error error message
 */
import { validate as validateEmail } from 'email-validator';
import React, { Dispatch } from 'react';
import { ReadonlyGuardedMap } from './map';

export type Validator<V> = (value: V) => string;

export type DefaultValueFactory<V> = () => V;

export interface FieldConfig<V> {
  validate: Validator<V>;
  getDefaultValue: DefaultValueFactory<V>;
}

export const f = <V>(
  validator: Validator<V>,
  defaultValueFactory: DefaultValueFactory<V>
): FieldConfig<V> => ({
  validate: validator,
  getDefaultValue: defaultValueFactory,
});

export const emptyString = () => '';

export type FormState<T> = [T[keyof T], Dispatch<T[keyof T]>][];

export function createState<T>(
  orderedKeys: ReadonlyArray<keyof T>,
  config: ReadonlyGuardedMap<keyof T, FieldConfig<T[keyof T]>>
): FormState<T> {
  const state = [];
  for (let i = 0; i < orderedKeys.length; i += 1) {
    state[i] = React.useState(config.get(orderedKeys[i]).getDefaultValue());
  }
  return state;
}

export type FormErrorsState = [string, Dispatch<any>][];

export function createErrorsState<T>(
  orderedKeys: ReadonlyArray<keyof T>
): FormErrorsState {
  const state = [];
  for (let i = 0; i < orderedKeys.length; i += 1) {
    state[i] = React.useState('');
  }
  return state;
}

export function updateValue<T>(
  i: number,
  value: T[keyof T],
  state: FormState<T>
) {
  state[i][1](value);
}

export function validateValue<T>(
  orderedKeys: ReadonlyArray<keyof T>,
  i: number,
  config: ReadonlyGuardedMap<keyof T, FieldConfig<T[keyof T]>>,
  value: T[typeof orderedKeys[typeof i]],
  errorsState: FormErrorsState
) {
  const error = config.get(orderedKeys[i]).validate(value);
  if (error) {
    errorsState[i][1](error);
  }
  return error;
}

export type FormFieldErrors = string[];

export function updateErrors<T>(
  orderedKeys: ReadonlyArray<keyof T>,
  config: ReadonlyGuardedMap<keyof T, FieldConfig<T[keyof T]>>,
  errorsState: FormErrorsState,
  state: FormState<T>
): FormFieldErrors {
  const errors = [];
  for (let i = 0; i < orderedKeys.length; i += 1) {
    const key = orderedKeys[i];
    const value = state[i][0];
    const error = config.get(key).validate(value);
    errors[i] = error;
    if (error) {
      errorsState[i][1](error);
    }
  }
  return errors;
}

export const hasErrors = (errors: FormFieldErrors) => errors.some((e) => !!e);

export function getEmailError(email: string) {
  return validateEmail(email)
    ? ''
    : 'Email must be valid, e.g. username@domain.com';
}
