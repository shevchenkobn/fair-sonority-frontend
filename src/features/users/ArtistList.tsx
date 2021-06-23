import { Chip, makeStyles, Paper, Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { createStyles } from '@material-ui/core/styles';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { NoteAdd, Visibility } from '@material-ui/icons';
import { Rating } from '@material-ui/lab';
import React, { MouseEventHandler } from 'react';
import { DeepReadonly, DeepReadonlyArray, Nullable } from '../../lib/types';
import { ArtistFull, RatingSeed } from '../../models/artist';
import { OrderSeed } from '../../models/order';
import { OrderCreate, OrderCreateProps } from '../orders/OrderCreate';
import { OrderDetailsProps } from '../orders/OrderDetails';

interface TableRow {
  /**
   * Order ID
   */
  id: string;
  fullName: string;
  rating: number;
  genres: string[];
  description: string;
  raw: DeepReadonly<ArtistFull>;
  handleForRatingSelect: MouseEventHandler<any>;
  handleForOrderSelect: MouseEventHandler<any>;
}

export interface ArtistListProps {
  artists: DeepReadonlyArray<ArtistFull>;
  disabled: boolean;
  onOrderCreate: OrderCreateProps['onOrderCreate'];
  onRatingCreate: (rating: RatingSeed) => Promise<void>;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    genres: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
  })
);

export function ArtistList({
  artists,
  disabled,
  onOrderCreate,
  onRatingCreate,
}: ArtistListProps) {
  const classes = useStyles();

  const [orderArtist, setOrderArtist] =
    React.useState<Nullable<DeepReadonly<ArtistFull>>>(null);
  const [ratingArtist, setRatingArtist] =
    React.useState<Nullable<DeepReadonly<ArtistFull>>>(null);
  const rows: TableRow[] = artists.map((a) => ({
    id: a._id,
    fullName: `${a.firstName} ${a.lastName} (${a.email})`,
    rating:
      a.ratings.length > 0
        ? a.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
          a.ratings.length
        : 0,
    genres: a.genres.slice(),
    description: a.profileDescription,
    raw: a,
    handleForRatingSelect: (event) => {
      event.preventDefault();
      setRatingArtist(a);
    },
    handleForOrderSelect: (event) => {
      event.preventDefault();
      setOrderArtist(a);
    },
  }));

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'fullName',
      headerName: 'Full Name',
      flex: 2,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      renderCell: ({ row }) => (
        <Tooltip title={row.rating} interactive>
          <span style={{ display: 'flex' }}>
            <Rating name="rating" value={row.rating} precision={0.1} readOnly />
          </span>
        </Tooltip>
      ),
      width: 140,
    },
    {
      field: 'genres',
      headerName: 'Genres',
      renderCell: ({ row }) => (
        <div className={classes.genres}>
          {(row.raw.genres as string[]).map((g) => (
            <Chip key={'genre.' + g} label={g} color="primary" />
          ))}
        </div>
      ),
      flex: 2.5,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 3,
    },
    {
      field: 'raw',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={params.row.handleForRatingSelect}
          >
            <Visibility />
          </IconButton>
          <IconButton color="primary" onClick={params.row.handleForOrderSelect}>
            <NoteAdd />
          </IconButton>
        </>
      ),
    },
  ];

  const handleOrderCreateClose: OrderDetailsProps['onClose'] = () => {
    setOrderArtist(null);
  };

  return (
    <Paper style={{ height: 800 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        checkboxSelection={false}
        // Some disabled stuff bellow
        disableSelectionOnClick={disabled}
        // disableMultipleSelection={disabled}
        disableColumnFilter={disabled}
        disableColumnMenu={disabled}
        // disableColumnReorder={disabled}
        // disableColumnResize={disabled}
        disableColumnSelector={disabled}
        disableDensitySelector={disabled}
        disableExtendRowFullWidth={disabled}
        // disableMultipleColumnsFiltering={disabled}
        // disableMultipleColumnsSorting={disabled}
      />
      {orderArtist && (
        <OrderCreate
          artist={orderArtist}
          onOrderCreate={onOrderCreate}
          onClose={handleOrderCreateClose}
        />
      )}
    </Paper>
  );
}
