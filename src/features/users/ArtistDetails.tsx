import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Send, Visibility } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import ChipInput from 'material-ui-chip-input';
import React, { MouseEventHandler } from 'react';
import { useAppSelector } from '../../app/hooks';
import { FieldConfig } from '../../lib/forms';
import { GuardedMap } from '../../lib/map';
import { DeepReadonly } from '../../lib/types';
import {
  ArtistFull,
  countRating,
  findRating,
  RatingSeed,
} from '../../models/artist';
import { UserRole } from '../../models/user';
import { selectAccount } from '../account/accountSlice';

export interface ArtistDetailsProps {
  artist: DeepReadonly<ArtistFull>;
  onRatingCreate: (rating: RatingSeed) => Promise<void>;
  onClose(): void;
}

export function ArtistDetails({
  artist,
  onRatingCreate,
  onClose,
}: ArtistDetailsProps) {
  const [open, setOpen] = React.useState(!!artist);
  const [loading, setLoading] = React.useState(false);

  const customerId = useAppSelector(selectAccount)?._id ?? '';
  const totalRating = countRating(artist.ratings);
  const userRated = findRating(customerId, artist.ratings);

  const [userRating, setUserRating] = React.useState(userRated);
  const [rated, setRated] = React.useState(userRated !== 0);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };
  const handleSubmit: MouseEventHandler<any> = (event) => {
    if (userRating === 0) {
      return;
    }
    event.preventDefault();
    setLoading(true);
    onRatingCreate({
      artistId: artist._id,
      rating: userRating,
      comment: ' ',
    })
      .then(() => setRated(true))
      .finally(() => setLoading(false));
  };
  return (
    <Dialog open={open} onClose={handleClose} disableBackdropClick={loading}>
      <DialogTitle>
        Artist {artist.firstName} {artist.lastName}
      </DialogTitle>
      <DialogContent>
        <LinearProgress className={loading ? '' : 'hidden'} />
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Artist Name:</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              {artist.firstName} {artist.lastName} (<em>{artist.email}</em>)
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Artist ID:</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">{artist._id}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Rating:</strong>
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', alignItems: 'center' }}>
            <Rating
              name="rating"
              value={totalRating}
              precision={0.1}
              readOnly
            />{' '}
            <span style={{ marginInlineStart: '0.5rem' }}>
              {totalRating} based on {artist.ratings.length} reviews
            </span>
          </Grid>
          <Grid item xs={12}>
            <ChipInput
              defaultValue={artist.genres.slice()}
              readOnly={true}
              label="Genres"
              color="primary"
              chipRenderer={({ text, className, value }, chipKey) => (
                <Chip
                  key={chipKey}
                  label={text}
                  id={`genre.${value}`}
                  className={className}
                  color="primary"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Description:</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">{artist.profileDescription}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Your review:</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            {rated ? (
              <Rating
                name="rating"
                value={userRated || userRating}
                precision={0.5}
                readOnly
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Rating
                  name="rating"
                  value={userRating}
                  onChange={(event, value) => setUserRating(value ?? 0)}
                  precision={0.5}
                />
                <IconButton
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <Send />
                </IconButton>
              </div>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
