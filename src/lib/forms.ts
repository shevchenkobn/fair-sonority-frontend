/**
 * @param value the value of the input
 * @returns error error message
 */
import { validate as validateEmail } from 'email-validator';
import React, { Dispatch } from 'react';
import { ReadonlyGuardedMap } from './map';
import { cast } from './types';

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

export type FormState<T extends Record<never, unknown>> = [
  T[keyof T],
  Dispatch<T[keyof T]>
][];

export function createState<T extends Record<never, unknown>>(
  orderedKeys: ReadonlyArray<keyof T>,
  config: ReadonlyGuardedMap<keyof T, FieldConfig<T[keyof T]>>
): FormState<T> {
  const state = [];
  for (let i = 0; i < orderedKeys.length; i += 1) {
    state[i] = React.useState(config.get(orderedKeys[i]).getDefaultValue());
  }
  return state;
}

export function createModel<T extends Record<never, unknown>>(
  orderedKeys: ReadonlyArray<keyof T>,
  state: FormState<T>
): T {
  return updateModel<T, Record<never, unknown>>({}, orderedKeys, state);
}

export function updateModel<T extends B, B extends Record<never, unknown>>(
  model: B,
  orderedKeys: ReadonlyArray<Exclude<keyof T, keyof B>>,
  state: FormState<Omit<T, keyof B>>
): T {
  cast<T>(model);
  for (let i = 0; i < orderedKeys.length; i += 1) {
    model[orderedKeys[i]] = state[i][0];
  }
  return model;
}

export type FormErrorsState = [string, Dispatch<any>][];

export function createErrorsState<T extends Record<never, unknown>>(
  orderedKeys: ReadonlyArray<keyof T>
): FormErrorsState {
  const state = [];
  for (let i = 0; i < orderedKeys.length; i += 1) {
    state[i] = React.useState('');
  }
  return state;
}

export function updateValue<T extends Record<never, unknown>>(
  state: FormState<T>,
  i: number,
  value: T[keyof T]
) {
  state[i][1](value);
}

export function value<
  T extends Record<never, unknown>,
  V extends T[keyof T] = T[keyof T]
>(state: FormState<T>, i: number): V {
  return state[i][0] as V;
}

export function validateValue<T extends Record<never, unknown>>(
  errorsState: FormErrorsState,
  i: number,
  value: T[typeof orderedKeys[typeof i]],
  orderedKeys: ReadonlyArray<keyof T>,
  config: ReadonlyGuardedMap<keyof T, FieldConfig<T[keyof T]>>
): string {
  const error = config.get(orderedKeys[i]).validate(value);
  errorsState[i][1](error);
  return error;
}

export function error(errorsState: FormErrorsState, i: number): string {
  return errorsState[i][0];
}

export type FormFieldErrors = string[];

export function updateErrors<T extends Record<never, unknown>>(
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
