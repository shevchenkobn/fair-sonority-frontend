import {
  Button,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@material-ui/core';
import { SelectInputProps } from '@material-ui/core/Select/SelectInput';
import ChipInput from 'material-ui-chip-input';
import React from 'react';
import { addAsterisk, Asterisk } from '../../components/forms';
import scss from '../../constants.module.scss';
import {
  createErrorsState,
  createModel,
  createState,
  emptyString,
  error,
  f,
  FieldConfig,
  getEmailError,
  hasErrors,
  updateErrors,
  updateModel,
  updateValue,
  validateValue,
  value,
} from '../../lib/forms';
import { GuardedMap } from '../../lib/map';
import { cast, t } from '../../lib/types';
import {
  ArtistNoId,
  UserBase,
  UserNoId,
  UserNoIdUnion,
  UserRole,
  userRoleLabels,
  validUserRoles,
} from '../../models/user';
import './Register.scss';

export interface RegisterProps {
  onUserChange(user: UserNoId): Promise<void>;
}

type OptionalUserRole = UserRole | '';

export function Register({ onUserChange }: RegisterProps) {
  const formState = createState<UserBase>(orderedKeys, formConfig);
  const formErrorsState = createErrorsState<UserBase>(orderedKeys);

  const [userRole, setUserRole] = React.useState<OptionalUserRole>('');
  const [userRoleError, setUserRoleError] = React.useState('');

  const [loading, setLoading] = React.useState(false);

  const artistFormState = createState<ArtistOnlyProps>(
    artistOnlyOrderedKeys,
    artistOnlyFormConfig
  );
  const artistFormErrorsState = createErrorsState(artistOnlyOrderedKeys);

  const handleUserRoleChange: SelectInputProps['onChange'] = (event) => {
    const userRole = event.target.value as OptionalUserRole;
    setUserRole(userRole);
    setUserRoleError(getUserRoleError(userRole));
  };
  const handleUserRoleValidation: SelectInputProps['onBlur'] = (event) => {
    setUserRoleError(getUserRoleError(event.target.value));
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    let errors = updateErrors<UserBase>(
      orderedKeys,
      formConfig,
      formErrorsState,
      formState
    );
    setUserRoleError(getUserRoleError(userRole));
    if (userRole === UserRole.Artist) {
      errors = errors.concat(
        updateErrors<ArtistOnlyProps>(
          artistOnlyOrderedKeys,
          artistOnlyFormConfig,
          artistFormErrorsState,
          artistFormState
        )
      );
    }
    if (!hasErrors(errors) && userRole) {
      setLoading(true);
      const model = createModel<UserBase>(orderedKeys, formState);
      cast<UserNoId>(model);
      model.role = userRole;
      if (userRole === UserRole.Artist) {
        updateModel<ArtistNoId, UserBase>(
          model,
          artistOnlyOrderedKeys,
          artistFormState
        );
      }
      onUserChange(model).catch(() => {
        setLoading(false);
      });
    }
  };

  return (
    <Paper className={scss.appRegisterClass}>
      <LinearProgress className={loading ? '' : 'hidden'} />
      <form onSubmit={handleFormSubmit} className="form-100-m1">
        {orderedKeys.map((key, i) => (
          <TextField
            key={key}
            value={value(formState, i)}
            onChange={(event) => {
              updateValue(formState, i, event.target.value);
              validateValue(
                formErrorsState,
                i,
                event.target.value,
                orderedKeys,
                formConfig
              );
            }}
            onBlur={(event) => {
              validateValue(
                formErrorsState,
                i,
                event.target.value,
                orderedKeys,
                formConfig
              );
            }}
            error={!!error(formErrorsState, i)}
            disabled={loading}
            id={key}
            label={addAsterisk(formLabels.get(key))}
            type={key === 'email' || key === 'password' ? key : 'text'}
            autoComplete={key}
            helperText={error(formErrorsState, i)}
          />
        ))}
        <FormControl error={!!userRoleError} color="secondary">
          <InputLabel id="userRoleLabel">
            User Role
            <Asterisk />
          </InputLabel>
          <Select
            labelId="userRoleLabel"
            id="userRole"
            value={userRole}
            onChange={handleUserRoleChange}
            onBlur={handleUserRoleValidation}
            disabled={loading}
          >
            <MenuItem value="">
              <em>Not selected</em>
            </MenuItem>
            {validUserRoles.map((role) => (
              <MenuItem key={`userRole.${role}`} value={role}>
                {userRoleLabels.get(role)}
              </MenuItem>
            ))}
          </Select>
          {userRoleError && <FormHelperText>{userRoleError}</FormHelperText>}
        </FormControl>
        {userRole === UserRole.Artist && (
          <>
            <Divider />
            {artistOnlyOrderedKeys.map((key, i): JSX.Element => {
              switch (key) {
                case 'genres':
                  return (
                    <ChipInput
                      className="m-b2"
                      key={key}
                      defaultValue={value<ArtistOnlyProps, string[]>(
                        artistFormState,
                        i
                      )}
                      onChange={(chips) => {
                        updateValue(artistFormState, i, chips);
                        validateValue(
                          artistFormErrorsState,
                          i,
                          chips,
                          artistOnlyOrderedKeys,
                          artistOnlyFormConfig
                        );
                      }}
                      onBlur={(event) => {
                        validateValue(
                          artistFormErrorsState,
                          i,
                          value(artistFormState, i),
                          artistOnlyOrderedKeys,
                          artistOnlyFormConfig
                        );
                      }}
                      blurBehavior="add"
                      error={!!error(artistFormErrorsState, i)}
                      disabled={loading}
                      id={key}
                      label={addAsterisk(formLabels.get(key))}
                      helperText={error(artistFormErrorsState, i)}
                      color="primary"
                      chipRenderer={(
                        { handleDelete, text, className, value, isDisabled },
                        chipKey
                      ) => (
                        <Chip
                          key={chipKey}
                          label={text}
                          id={`genre.${value}`}
                          className={className}
                          onDelete={handleDelete}
                          color="primary"
                          disabled={isDisabled}
                        />
                      )}
                    />
                  );
                case 'profileDescription':
                  return (
                    <TextField
                      key={key}
                      value={value(artistFormState, i)}
                      onChange={(event) => {
                        updateValue(artistFormState, i, event.target.value);
                        validateValue(
                          artistFormErrorsState,
                          i,
                          event.target.value,
                          artistOnlyOrderedKeys,
                          artistOnlyFormConfig
                        );
                      }}
                      onBlur={(event) => {
                        validateValue(
                          artistFormErrorsState,
                          i,
                          event.target.value,
                          artistOnlyOrderedKeys,
                          artistOnlyFormConfig
                        );
                      }}
                      error={!!error(artistFormErrorsState, i)}
                      disabled={loading}
                      id={key}
                      label={addAsterisk(formLabels.get(key))}
                      helperText={error(artistFormErrorsState, i)}
                      multiline
                      rows={7}
                      variant="outlined"
                    />
                  );
              }
            })}
          </>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Register
        </Button>
      </form>
    </Paper>
  );
}

const formLabels = new GuardedMap<keyof UserNoIdUnion, string>([
  t('email', 'Email'),
  t('password', 'Password'),
  t('firstName', 'First Name'),
  t('lastName', 'Last Name'),
  t('genres', 'Genres'),
  t('profileDescription', 'Profile Description'),
]);

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
    f<string>((value) => (value ? '' : 'Last Name is required'), emptyString)
  ),
]);
const orderedKeys = Array.from(formConfig.keys()); // as (keyof UserBase)[];

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

function getUserRoleError(userRole: OptionalUserRole) {
  return userRole ? '' : 'User Role must be selected';
}
