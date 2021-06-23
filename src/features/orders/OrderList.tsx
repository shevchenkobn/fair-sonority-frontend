import { Chip, Paper } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { Visibility } from '@material-ui/icons';
import React, { MouseEventHandler } from 'react';
import {
  DeepReadonly,
  DeepReadonlyArray,
  Nullable,
  Optional,
} from '../../lib/types';
import {
  OrderDetailed,
  OrderStatus,
  orderStatusLabels,
} from '../../models/order';
import { OrderDetails, OrderDetailsProps } from './OrderDetails';

export interface OrderListProps {
  orders: DeepReadonlyArray<OrderDetailed>;
  disabled: boolean;
  onOrderUpdate: OrderDetailsProps['onOrderUpdate'];
}

interface TableRow {
  /**
   * Order ID
   */
  id: string;
  user: string;
  status: string;
  deadline: string;
  comment: string;
  raw: DeepReadonly<OrderDetailed>;
  handleOrderSelect: MouseEventHandler<any>;
}

export function OrderList({ orders, onOrderUpdate, disabled }: OrderListProps) {
  const [selectedOrder, setSelectedOrder] =
    React.useState<Nullable<DeepReadonly<OrderDetailed>>>(null);
  const rows: TableRow[] = orders.map((o) => ({
    id: o.order._id,
    user: `${o.user.name} ${o.user.lastName} (${o.user.email})`,
    status: orderStatusLabels.get(o.order.status) ?? o.order.status,
    deadline: new Date(o.order.deadline).toLocaleString(),
    comment: o.order.comment,
    raw: o,
    handleOrderSelect: (event) => {
      setSelectedOrder(o);
      event.preventDefault();
    },
  }));

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'user',
      headerName: 'User',
      flex: 2,
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => <Chip label={row.status} color="secondary" />,
      flex: 1,
    },
    {
      field: 'deadline',
      headerName: 'Deadline',
      flex: 1,
    },
    {
      field: 'comment',
      headerName: 'Comment',
      flex: 2.5,
    },
    {
      field: 'raw',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      flex: 0.8,
      renderCell: (params) => (
        <IconButton color="primary" onClick={params.row.handleOrderSelect}>
          <Visibility />
        </IconButton>
      ),
    },
  ];

  const handleOrderDetailsClose: OrderDetailsProps['onClose'] = () => {
    setSelectedOrder(null);
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
      {selectedOrder && (
        <OrderDetails
          onOrderUpdate={onOrderUpdate}
          order={selectedOrder}
          onClose={handleOrderDetailsClose}
        />
      )}
    </Paper>
  );
}
