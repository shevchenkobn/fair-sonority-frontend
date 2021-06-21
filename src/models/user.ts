import { JwtPayload } from 'jwt-decode';
import { GuardedMap, ReadonlyGuardedMap } from '../lib/map';
import { t } from '../lib/types';

export enum UserRole {
  Artist = 'artist',
  Customer = 'customer',
}

export const validUserRoles = Object.values(
  UserRole
) as ReadonlyArray<UserRole>;

export const userRoleLabels = new GuardedMap<UserRole, string>([
  t(UserRole.Artist, 'Artist'),
  t(UserRole.Customer, 'Customer'),
]) as ReadonlyGuardedMap<UserRole, string>;

export interface Account {
  role: UserRole;
  userId: string;
  email: string;
}

export type User = Omit<UserNoId, 'password'> & UserId;
export type UserByRole = {
  [P in keyof UserNoIdByRole]: UserNoIdByRole[P] & UserId;
};
export type UserId = { _id: string };
export type UserNoIdUnion = CustomerNoId & ArtistNoId;
export type UserNoId = CustomerNoId | ArtistNoId;
export type UserNoIdByRole = {
  [UserRole.Customer]: CustomerNoId;
  [UserRole.Artist]: ArtistNoId;
};

export interface UserBase<R extends UserRole = UserRole> {
  email: string;
  role: R;
  password: string;
  firstName: string;
  lastName: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomerNoId extends UserBase<UserRole.Customer> {}

export interface ArtistNoId extends UserBase<UserRole.Artist> {
  genres: string[];
  profileDescription: string;
}

export interface TokenPayload extends JwtPayload {
  /**
   * User ID
   */
  sub: string;
  /**
   * Email
   */
  pathname: string;
  role: UserRole;
}
