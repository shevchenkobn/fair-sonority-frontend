import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  TextField,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import dayjs from 'dayjs';
import ChipInput from 'material-ui-chip-input';
import React, { MouseEventHandler } from 'react';
import { addAsterisk } from '../../components/forms';
import {
  createModel,
  emptyString,
  error,
  f,
  FieldConfig,
  hasErrors,
  updateErrors,
  updateModel,
  updateValue,
  useFormErrorsState,
  useFormState,
  validateValue,
  value,
} from '../../lib/forms';
import { GuardedMap } from '../../lib/map';
import { as, DeepReadonly, t } from '../../lib/types';
import { ArtistFull } from '../../models/artist';
import { OrderSeed } from '../../models/order';

export interface OrderCreateProps {
  artist: DeepReadonly<ArtistFull>;
  onOrderCreate: (order: OrderSeed) => Promise<void>;
  onClose(): void;
}

export function OrderCreate({
  artist,
  onOrderCreate,
  onClose,
}: OrderCreateProps) {
  const [open, setOpen] = React.useState(!!artist);
  const [loading, setLoading] = React.useState(false);

  const formConfig = createFormConfig(artist);
  const orderedKeys = Array.from(formConfig.keys());

  const formState = useFormState<OrderSeed>(orderedKeys, formConfig);
  const formErrorsState = useFormErrorsState<OrderSeed>(orderedKeys);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };
  const handleFormSubmit: MouseEventHandler<any> = () => {
    const errors = updateErrors<OrderSeed>(
      orderedKeys,
      formConfig,
      formErrorsState,
      formState
    );
    if (!hasErrors(errors)) {
      const order = updateModel<OrderSeed, Pick<OrderSeed, 'artistId'>>(
        {
          artistId: artist._id,
        },
        orderedKeys as Exclude<keyof OrderSeed, 'artistId'>[],
        formState
      );
      setLoading(true);
      onOrderCreate(order)
        .then(() => onClose())
        .catch(() => setLoading(false));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} disableBackdropClick={true}>
      <DialogTitle>New Order</DialogTitle>
      <DialogContent>
        <LinearProgress className={loading ? '' : 'hidden'} />
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Artist:</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              {artist.firstName} {artist.lastName} (<em>{artist.email}</em>)
            </Typography>
          </Grid>
        </Grid>
        <form className="form-100-m1">
          {orderedKeys.map((key, i): JSX.Element => {
            switch (key) {
              case 'bpm':
                return (
                  <TextField
                    key={key}
                    value={value(formState, i)}
                    onChange={(event) => {
                      updateValue(
                        formState,
                        i,
                        event.target.value,
                        orderedKeys,
                        formConfig
                      );
                      validateValue(
                        formErrorsState,
                        i,
                        event.target.value,
                        orderedKeys,
                        formConfig
                      );
                    }}
                    onBlur={(event) => {
                      validateValue(
                        formErrorsState,
                        i,
                        event.target.value,
                        orderedKeys,
                        formConfig
                      );
                    }}
                    error={!!error(formErrorsState, i)}
                    disabled={loading}
                    id={key}
                    label={addAsterisk('Beats per minute (BPM)')}
                    type="number"
                    autoComplete={key}
                    helperText={error(formErrorsState, i)}
                  />
                );
              case 'comment':
                return (
                  <TextField
                    key={key}
                    value={value(formState, i)}
                    onChange={(event) => {
                      updateValue(
                        formState,
                        i,
                        event.target.value,
                        orderedKeys,
                        formConfig
                      );
                      validateValue(
                        formErrorsState,
                        i,
                        event.target.value,
                        orderedKeys,
                        formConfig
                      );
                    }}
                    onBlur={(event) => {
                      validateValue(
                        formErrorsState,
                        i,
                        event.target.value,
                        orderedKeys,
                        formConfig
                      );
                    }}
                    error={!!error(formErrorsState, i)}
                    disabled={loading}
                    id={key}
                    label={addAsterisk('Description')}
                    helperText={error(formErrorsState, i)}
                    multiline
                    rows={7}
                    variant="outlined"
                  />
                );
              case 'genre':
                return (
                  <ChipInput
                    className="m-b2"
                    key={key}
                    defaultValue={value<OrderSeed, string[]>(formState, i)}
                    onChange={(chips) => {
                      updateValue(formState, i, chips, orderedKeys, formConfig);
                      validateValue(
                        formErrorsState,
                        i,
                        chips,
                        orderedKeys,
                        formConfig
                      );
                    }}
                    onBlur={(event) => {
                      validateValue(
                        formErrorsState,
                        i,
                        value(formState, i),
                        orderedKeys,
                        formConfig
                      );
                    }}
                    blurBehavior="add"
                    error={!!error(formErrorsState, i)}
                    disabled={loading}
                    id={key}
                    label={addAsterisk('Genres')}
                    helperText={error(formErrorsState, i)}
                    color="primary"
                    chipRenderer={(
                      { handleDelete, text, className, value, isDisabled },
                      chipKey
                    ) => (
                      <Chip
                        key={chipKey}
                        label={text}
                        id={`genre.${value}`}
                        className={className}
                        onDelete={handleDelete}
                        color="primary"
                        disabled={isDisabled}
                      />
                    )}
                  />
                );
              case 'date':
                return (
                  <KeyboardDateTimePicker
                    key={key}
                    variant="inline"
                    ampm={false}
                    label={addAsterisk('Deadline')}
                    value={value(formState, i)}
                    onChange={(date) => {
                      updateValue(formState, i, date, orderedKeys, formConfig);
                      validateValue(
                        formErrorsState,
                        i,
                        date,
                        orderedKeys,
                        formConfig
                      );
                    }}
                    onBlur={(event) => {
                      validateValue(
                        formErrorsState,
                        i,
                        event.target.value,
                        orderedKeys,
                        formConfig
                      );
                    }}
                    onError={(error, value) => {
                      if (value) {
                        formErrorsState[i][1](
                          error || formConfig.get(key).validate(value)
                        );
                      }
                    }}
                    disabled={loading}
                    error={!!error(formErrorsState, i)}
                    helperText={error(formErrorsState, i)}
                    minDateMessage="Deadline cannot be in the past"
                    disablePast
                    format="YYYY-MM-DD HH:mm"
                  />
                );
              default:
                return <></>;
            }
          })}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFormSubmit} color="secondary">
          Create Order (Place)
        </Button>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const createFormConfig = (artist: DeepReadonly<ArtistFull>) =>
  new GuardedMap<keyof OrderSeed, FieldConfig<any>>([
    t(
      'bpm' as keyof OrderSeed,
      f<string>(
        (value) => (value ? '' : 'BPM is required'),
        emptyString,
        (value) =>
          typeof value === 'number' && value <= 0 && value % 1 === 0
            ? ''
            : String(value)
      )
    ),
    t(
      'comment' as keyof OrderSeed,
      f<string>((value) => (value ? '' : 'Comment is required'), emptyString)
    ),
    t(
      'genre' as keyof OrderSeed,
      f<string[]>(
        (value) => {
          if (!value || value.length === 0) {
            return 'At least one genre is required';
          }
          return value.some((g) => artist.genres.includes(g))
            ? ''
            : "At least one genre must be similar with artist's specialization";
        },
        () => []
      )
    ),
    t(
      'date' as keyof OrderSeed,
      f<string>(
        (value) => (value ? '' : 'Deadline is required'),
        () => null,
        (date) =>
          date instanceof Object &&
          as<Record<any, any>>(date) &&
          typeof date.toISOString === 'function'
            ? date.toISOString()
            : String(date)
      )
    ),
  ]);
