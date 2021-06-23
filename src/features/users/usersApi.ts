import { addExcludedPaths, api, selectData } from '../../app/api';
import { ArtistFull, RatingSeed } from '../../models/artist';
import { UserByRole, UserNoIdByRole, UserRole } from '../../models/user';

const createRegisterUrl = (role: UserRole) => `user/${role}`;
addExcludedPaths(...Object.values(UserRole).map((s) => createRegisterUrl(s)));

export function registerApi<R extends UserRole = UserRole>(
  user: UserNoIdByRole[R]
): Promise<UserByRole[R]> {
  return api.post(createRegisterUrl(user.role), user).then(selectData);
}

export function fetchArtistsApi(): Promise<ArtistFull[]> {
  return api.get('api/artist').then(selectData);
}

export function createArtistRatingApi(rating: RatingSeed): Promise<void> {
  return api.post('api/artist/rating', rating).then(selectData);
}
