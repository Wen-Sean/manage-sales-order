import { useEffect, useState } from 'react'
import { Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { getSalesOrders, getSalesOrdersCount } from '../../api/salesorders'

export default function PreviewPage() {
  const [salesOrders, setSalesOrders] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [rowCount, setRowCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData(paginationModel.page + 1) // 後端 page 從 1 開始
  }, [paginationModel])

  const fetchData = async (page) => {
    setLoading(true)
    try {
      const data = await getSalesOrders(page)
      setSalesOrders(data.value || data)
      const countData = await getSalesOrdersCount()
      setRowCount(countData.count || countData)
    } catch (err) {
      console.error('❌ 取得資料錯誤:', err)
    } finally {
      setLoading(false)
    }
  }

  const rows = salesOrders.map((so, index) => ({
    id: so.SalesOrder || index,
    SalesOrder: so.SalesOrder,
    SalesOrderType: so.SalesOrderType,
    SoldToParty: so.SoldToParty,
    SalesOrganization: so.SalesOrganization,
    DistributionChannel: so.DistributionChannel,
    OrganizationDivision: so.OrganizationDivision,
    PurchaseOrderByCustomer: so.PurchaseOrderByCustomer,
    CompleteDeliveryIsDefined: so.CompleteDeliveryIsDefined,
    SalesOrderDate: so.SalesOrderDate,
    RequestedDeliveryDate: so.RequestedDeliveryDate,
  }))

  const columns = [
    { field: 'SalesOrder', headerName: 'SalesOrder', width: 200 },
    { field: 'SalesOrderType', headerName: 'SalesOrderType', width: 200 },
    { field: 'SoldToParty', headerName: 'SoldToParty', width: 200 },
    { field: 'SalesOrganization', headerName: 'SalesOrganization', width: 200 },
    { field: 'DistributionChannel', headerName: 'DistributionChannel', width: 200 },
    { field: 'OrganizationDivision', headerName: 'OrganizationDivision', width: 200 },
    { field: 'PurchaseOrderByCustomer', headerName: 'PurchaseOrderByCustomer', width: 200 },
    { field: 'CompleteDeliveryIsDefined', headerName: 'CompleteDeliveryIsDefined', width: 200 },
    { field: 'SalesOrderDate', headerName: 'SalesOrderDate', width: 200 },
    { field: 'RequestedDeliveryDate', headerName: 'RequestedDeliveryDate', width: 200 },
  ]

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10]}
        rowCount={rowCount}
        paginationMode="server"
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        checkboxSelection={false}
        loading={loading}
        sx={{ border: 0 }}
      />
    </Paper>
  )
}