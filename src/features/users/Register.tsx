import { validate as validateEmail } from 'email-validator';
import { emptyString, f, FieldConfig, Validator } from '../../lib/forms';
import { GuardedMap } from '../../lib/map';
import { t } from '../../lib/types';
import {
  ArtistNoId,
  UserBase,
  UserNoId,
  UserNoIdUnion,
} from '../account/types';

export interface RegisterProps {
  onUserChange(user: UserNoId): Promise<void>;
}

export function Register({ onUserChange }: RegisterProps) {
  return <></>;
}

const fieldValidators = new GuardedMap<keyof UserBase, FieldConfig<any>>([
  t(
    'email' as keyof UserBase,
    f<string>(
      (value) => (validateEmail(value) ? '' : 'First Name is required'),
      emptyString
    )
  ),
  t(
    'password' as keyof UserBase,
    f<string>((value) => (value ? '' : 'Password is required'), emptyString)
  ),
  t(
    'firstName' as keyof UserBase,
    f<string>((value) => (value ? '' : 'First Name is required'), emptyString)
  ),
  t(
    'lastName' as keyof UserBase,
    f<string>(
      (value: string) => (value ? '' : 'Last Name is required'),
      emptyString
    )
  ),
]);
const orderedKeys = Object.keys(fieldValidators);

const artisFieldValidators = new GuardedMap<keyof ArtistNoId, FieldConfig<any>>(
  [
    t(
      'genres' as keyof ArtistNoId,
      f<string[]>(
        (value: string[]) => {
          if (value.length === 0) {
            return 'At least one genre is required';
          }
          if (value.some((g) => g.length === 0)) {
            return 'All genres must be non-empty';
          }
          return '';
        },
        () => []
      )
    ),
    t(
      'profileDescription' as keyof ArtistNoId,
      f<string>(
        (value: string) => (value ? '' : 'Profile Description is required'),
        emptyString
      )
    ),
  ]
);
const artistOnlyKeys: (keyof ArtistNoId)[] = ['genres', 'profileDescription'];
