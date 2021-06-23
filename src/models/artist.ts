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
