import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import {
  createErrorsState,
  createState,
  emptyString,
  f,
  FieldConfig,
  FormErrorsState,
  FormState,
  getEmailError,
} from '../../lib/forms';
import { GuardedMap } from '../../lib/map';
import { t } from '../../lib/types';
import { UserRole } from '../../models/user';
import { ArtistNoId, UserBase, UserNoId } from '../account/types';

export interface RegisterProps {
  onUserChange(user: UserNoId): Promise<void>;
}

const useStyles = makeStyles((theme) => {
  createStyles({});
});

export function Register({ onUserChange }: RegisterProps) {
  const classes = useStyles();

  const formState = createState<UserBase>(orderedKeys, formConfig);
  const formErrorsState = createErrorsState<UserBase>(orderedKeys);
  const [userRole, setUserRole] = React.useState<UserRole | ''>('');
  const [loading, setLoading] = React.useState(false);
  let additionalFormState: FormState<ArtistOnlyProps> = [];
  let additionalFormErrorsState: FormErrorsState = [];
  if (userRole === UserRole.Artist) {
    additionalFormState = createState(
      artistOnlyOrderedKeys,
      artistOnlyFormConfig
    );
    additionalFormErrorsState = createErrorsState(artistOnlyOrderedKeys);
  }

  return <></>;
}

const formConfig = new GuardedMap<keyof UserBase, FieldConfig<any>>([
  t('email' as keyof UserBase, f<string>(getEmailError, emptyString)),
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
const orderedKeys = Object.keys(formConfig) as (keyof UserBase)[];

type ArtistOnlyProps = Omit<ArtistNoId, keyof UserBase>;
const artistOnlyFormConfig = new GuardedMap<
  keyof ArtistOnlyProps,
  FieldConfig<any>
>([
  t(
    'genres' as keyof ArtistOnlyProps,
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
    'profileDescription' as keyof ArtistOnlyProps,
    f<string>(
      (value: string) => (value ? '' : 'Profile Description is required'),
      emptyString
    )
  ),
]);
const artistOnlyOrderedKeys: (keyof ArtistOnlyProps)[] = [
  'genres',
  'profileDescription',
];
