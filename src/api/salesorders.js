import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api/salesorders'

//分頁取得SalesOrder
export const getSalesOrders = async (page = 1) => {
  const response = await axios.get(BASE_URL, { params: { page } })
  return response.data
}

//SO總筆數
export const getSalesOrdersCount = async () => {
  const response = await axios.get(BASE_URL, { params: { count: true } })
  return response.data
}

//模糊搜尋SalesOrder
export const getSalesOrderById = async (id) => {
  const response = await axios.get(BASE_URL, { params: { id } })
  return response.data
}

// 更新單筆
export const updateSalesOrder = async (id, body) => {
  const res = await axios.patch(`${BASE_URL}?id=${id}`, body)
  return res.data
}