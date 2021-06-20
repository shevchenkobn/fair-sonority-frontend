import { addExcludedPaths, api } from '../../app/api';
import { UserRole } from '../../models/user';
import { UserByRole, UserNoIdByRole } from '../account/types';

const createRegisterUrl = (role: UserRole) => `user/${role}`;
addExcludedPaths(...Object.values(UserRole).map((s) => createRegisterUrl(s)));

export function registerApi<R extends UserRole = UserRole>(
  user: UserNoIdByRole[R]
): Promise<UserByRole[R]> {
  return api.post(createRegisterUrl(user.role)).then((res) => res.data);
}
