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
import React, { MouseEventHandler } from 'react';
import { getUrlError } from '../../lib/forms';
import { DeepReadonly, Nullable } from '../../lib/types';
import {
  Order,
  OrderStatus,
  orderStatusLabels,
  OrderUpdate,
} from '../../models/order';

export interface OrderDetailsProps {
  order: DeepReadonly<Order>;
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
        setLoading(true);
        orderUpdate = {
          orderId: order.order._id,
          status: OrderStatus.Done,
          resultUrl,
        };
      }
    } else {
      setLoading(true);
      orderUpdate = {
        orderId: order.order._id,
        status: OrderStatus.InProgress,
      };
    }
    if (orderUpdate) {
      onOrderUpdate(orderUpdate)
        .then(() => onClose())
        .catch(() => setLoading(false));
    }
  };

  const handleResultUrlChange: StandardInputProps['onChange'] = (event) => {
    setResultUrl(event.target.value);
    setResultUrlError(event.target.value);
  };
  const handleResultUrlValidation: StandardInputProps['onBlur'] = (event) => {
    setResultUrlError(getUrlError(resultUrl));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
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
            <Typography variant="body1">
              <ChipInput
                defaultValue={order.order.genre.slice()}
                readOnly={true}
                label="Genres"
                color="primary"
                chipRenderer={(
                  { handleDelete, text, className, value },
                  chipKey
                ) => (
                  <Chip
                    key={chipKey}
                    label={text}
                    id={`genre.${value}`}
                    className={className}
                    color="primary"
                  />
                )}
              />
            </Typography>
          </Grid>
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

        {order.order.status === OrderStatus.InProgress && (
          <TextField
            value={resultUrl}
            onChange={handleResultUrlChange}
            onBlur={handleResultUrlValidation}
            error={!!resultUrlError}
            disabled={loading}
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            helperText={resultUrlError}
          />
        )}
      </DialogContent>
      <DialogActions>
        {isDone(order) && (
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
      return `Start Order (${orderStatusLabels.get(status)})`;
    case OrderStatus.InProgress:
      return `Finish Order (${orderStatusLabels.get(status)})`;
  }
}

function isDone(order: DeepReadonly<Order>) {
  return order.order.status !== OrderStatus.Done;
}
