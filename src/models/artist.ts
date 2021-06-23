import { DeepReadonlyArray } from '../lib/types';
import { Order } from './order';
import { ArtistNoId, UserId } from './user';

export interface ArtistFull extends Omit<ArtistNoId, 'password'>, UserId {
  orders: Order[];
  ratings: Rating[];
}

export interface RatingSeed {
  artistId: string;
  rating: number;
  comment: string;
}

export interface Rating {
  /**
   * Customer ID
   */
  userId: string;
  artistId: string;
  rating: number;
  comment: string;
  /**
   * ISO 8601
   */
  timestamp: string;
}

export const countRating = (
  ratings: DeepReadonlyArray<Pick<Rating, 'rating'>>
) =>
  ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
    : 0;

export const findRating = (
  customerId: string,
  ratings: DeepReadonlyArray<Rating>
) => ratings.find((r) => r.userId === customerId)?.rating ?? 0;
