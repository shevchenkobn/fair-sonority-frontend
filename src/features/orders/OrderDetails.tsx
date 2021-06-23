import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  Link,
  TextField,
} from '@material-ui/core';
import { InputProps as StandardInputProps } from '@material-ui/core/Input/Input';
import Typography from '@material-ui/core/Typography';
import ChipInput from 'material-ui-chip-input';
import React, { MouseEventHandler, useEffect } from 'react';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { useAppSelector } from '../../app/hooks';
import { getUrlError } from '../../lib/forms';
import { asEffectReset } from '../../lib/rx';
import { DeepReadonly, Nullable } from '../../lib/types';
import {
  OrderDetailed,
  OrderStatus,
  orderStatusLabels,
  OrderUpdate,
} from '../../models/order';
import { UserRole } from '../../models/user';
import { getState$ } from '../../store';
import { selectRole } from '../account/accountSlice';

export interface OrderDetailsProps {
  order: DeepReadonly<OrderDetailed>;
  onOrderUpdate(update: OrderUpdate): Promise<void>;
  onClose(): void;
}

export function OrderDetails({
  order,
  onOrderUpdate,
  onClose,
}: OrderDetailsProps) {
  const [open, setOpen] = React.useState(!!order);
  const [loading, setLoading] = React.useState(false);
  const [resultUrl, setResultUrl] = React.useState('');
  const [resultUrlError, setResultUrlError] = React.useState('');
  const [role, setRole] = React.useState(useAppSelector(selectRole));
  useEffect(
    () =>
      asEffectReset(
        getState$()
          .pipe(map(selectRole), distinctUntilChanged())
          .subscribe(setRole)
      ),
    []
  );

  const handleClose = () => {
    setOpen(false);
    onClose();
  };
  const handleSubmit: MouseEventHandler<any> = (event) => {
    event.preventDefault();
    let orderUpdate: Nullable<OrderUpdate> = null;
    if (order.order.status === OrderStatus.InProgress) {
      const resultUrlError = getUrlError(resultUrl);
      setResultUrlError(resultUrlError);
      if (!resultUrlError) {
        orderUpdate = {
          orderId: order.order._id,
          status: OrderStatus.Done,
          resultUrl,
        };
      }
    } else {
      orderUpdate = {
        orderId: order.order._id,
        status: OrderStatus.InProgress,
      };
    }
    if (orderUpdate) {
      setLoading(true);
      onOrderUpdate(orderUpdate)
        .then(() => onClose())
        .catch(() => setLoading(false));
    }
  };

  const handleResultUrlChange: StandardInputProps['onChange'] = (event) => {
    setResultUrl(event.target.value);
    setResultUrlError(getUrlError(event.target.value));
  };
  const handleResultUrlValidation: StandardInputProps['onBlur'] = (event) => {
    setResultUrlError(getUrlError(resultUrl));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableBackdropClick={loading || !!resultUrl}
    >
      <DialogTitle>Order #{order.order._id}</DialogTitle>
      <DialogContent>
        <LinearProgress className={loading ? '' : 'hidden'} />
        <Grid container>
          <Grid item xs={12}>
            <Chip
              label={
                orderStatusLabels.get(order.order.status) ?? order.order.status
              }
              color="secondary"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>User (2nd party):</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              {order.user.name} {order.user.lastName} (
              <em>{order.user.email}</em>)
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Comment</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">{order.order.comment}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Placed At</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              {new Date(order.order.datePlaced).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Deadline At</strong>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              {new Date(order.order.deadline).toLocaleString()}
            </Typography>
          </Grid>
          {/*<Grid item xs={6}>*/}
          {/*  <Typography variant="body1">*/}
          {/*    <strong>Genres</strong>*/}
          {/*  </Typography>*/}
          {/*</Grid>*/}
          <Grid item xs={12}>
            <ChipInput
              defaultValue={order.order.genre.slice()}
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
          {order.order.bpm && (
            <>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Beats per minute (bpm)</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{order.order.bpm}</Typography>
              </Grid>
            </>
          )}
          {order.order.resultUrl && (
            <>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Result URL</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <Link
                    href={order.order.resultUrl}
                    rel="noopener"
                    target="_blank"
                  >
                    {order.order.resultUrl}
                  </Link>
                </Typography>
              </Grid>
            </>
          )}
        </Grid>

        {role === UserRole.Artist &&
          order.order.status === OrderStatus.InProgress && (
            <TextField
              className="form-control-100"
              value={resultUrl}
              onChange={handleResultUrlChange}
              onBlur={handleResultUrlValidation}
              error={!!resultUrlError}
              disabled={loading}
              id="url"
              label="Result URL"
              type="url"
              autoComplete="url"
              helperText={resultUrlError}
            />
          )}
      </DialogContent>
      <DialogActions>
        {role === UserRole.Artist && isDone(order) && (
          <Button onClick={handleSubmit} color="secondary">
            {getButtonName(order.order.status)}
          </Button>
        )}
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function getButtonName(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Placed:
      return `Start Order (${orderStatusLabels.get(OrderStatus.InProgress)})`;
    case OrderStatus.InProgress:
      return `Finish Order (${orderStatusLabels.get(OrderStatus.Done)})`;
  }
}

function isDone(order: DeepReadonly<OrderDetailed>) {
  return order.order.status !== OrderStatus.Done;
}
