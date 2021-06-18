export enum UserRole {
  Artist = 'artist',
  Customer = 'customer',
}

export interface Me {
  role: UserRole;
  userId: string;
  username: string;
}
