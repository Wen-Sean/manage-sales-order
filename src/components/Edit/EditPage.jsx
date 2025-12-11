import { useState } from 'react';
import { Paper, Button, Box, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getSalesOrderById } from '../../api/salesorders';
import EditHeaderPage from './EditHeaderPage';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const columns = [
  { field: 'SalesOrder', headerName: 'SalesOrder', width: 200 },
  { field: 'SalesOrderType', headerName: 'SalesOrderType', width: 200 },
  { field: 'SoldToParty', headerName: 'Sold To Party', width: 200 },
  { field: 'SalesOrganization', headerName: 'SalesOrganization', width: 200 },
  { field: 'DistributionChannel', headerName: 'DistributionChannel', width: 200 },
  { field: 'OrganizationDivision', headerName: 'OrganizationDivision', width: 200 },
  { field: 'PurchaseOrderByCustomer', headerName: 'PurchaseOrderByCustomer', width: 200 },
  { field: 'CompleteDeliveryIsDefined', headerName: 'CompleteDeliveryIsDefined', width: 200 },
  { field: 'SalesOrderDate', headerName: 'SalesOrderDate', width: 200 },
  { field: 'RequestedDeliveryDate', headerName: 'RequestedDeliveryDate', width: 200 },
];

export default function EditPage() {
  const [query, setQuery] = useState('');
  const [salesOrders, setSalesOrders] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null)
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState();

  const fetchSalesOrders = async () => {
    setLoading(true);
    try {
      const data = await getSalesOrderById(query);
      setSalesOrders(data.value || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (params) => {
    setSelectedRow(params.row) //選中row
  };

  return editing && selectedRow ? (
    <EditHeaderPage
      row={selectedRow}
      onClose={() => {
        setEditing(false);
        setSelectedRow(null);
      }}
      onUpdated={() => fetchSalesOrders()}
      status={(status) => {
        console.log(status);
        setOpen(true);
        setNewStatus(status);
      }}
    />
  ) : (
    <Box>
      <Box sx={{ mb: 2 }}>
        {open && newStatus=='success' && 
          <Alert severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton> 
          }
          >
            修改成功
          </Alert>
        }
        {open && newStatus === 'failed' && 
          <Alert 
            severity="error" // 使用 error 級別
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton> 
            }
          >
            修改失敗
          </Alert>
        }
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <TextField
          label="查詢條件"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={fetchSalesOrders}>
          查詢
        </Button>
        <Button
          variant="outlined"
          onClick={() => setEditing(true)}
          disabled={!selectedRow}
        >
          修改
        </Button>
      </Box>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
            rows={salesOrders.map((so, index) => ({ id: so.SalesOrder || index, ...so }))}
            columns={columns}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 10,
                },
            },
            }}
            pageSizeOptions={[5,10,15,20]}
            onRowClick={handleRowClick}
            loading={loading}
            sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
}