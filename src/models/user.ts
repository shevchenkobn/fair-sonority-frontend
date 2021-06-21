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
  username: string;
}
