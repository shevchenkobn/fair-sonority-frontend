import { UserRole } from '../../models/user';

export interface Credentials {
  username: string;
  password: string;
}

export type User = UserNoId & UserId;
export type UserByRole = {
  [P in keyof UserNoIdByRole]: UserNoIdByRole[P] & UserId;
};

export type UserId = { id: string };

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
