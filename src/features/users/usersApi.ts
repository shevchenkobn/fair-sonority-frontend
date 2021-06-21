import { addExcludedPaths, api } from '../../app/api';
import { UserByRole, UserNoIdByRole, UserRole } from '../../models/user';

const createRegisterUrl = (role: UserRole) => `user/${role}`;
addExcludedPaths(...Object.values(UserRole).map((s) => createRegisterUrl(s)));

export function registerApi<R extends UserRole = UserRole>(
  user: UserNoIdByRole[R]
): Promise<UserByRole[R]> {
  return api.post(createRegisterUrl(user.role), user).then((res) => res.data);
}
