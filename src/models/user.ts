export enum UserRole {
  Artist = 'artist',
  Customer = 'customer',
}

export interface Account {
  role: UserRole;
  userId: string;
  username: string;
}
