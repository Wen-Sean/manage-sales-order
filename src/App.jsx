import { 
  Container, 
  Card, 
  CardContent, 
  Typography,
  Box,
  Tab,
  Tabs 
} from '@mui/material'
import { useState } from 'react'
import PreviewPage from './components/Read/PreviewPage'
import EditPage from './components/Edit/EditPage'
import CreatePage from './components/Create/CreatePage'

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function App() {
  const [tabIndex, setTabIndex] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  return (
    <Container sx={{ marginTop: 1 }}>
      <Card sx={{ marginBottom: 2, backgroundColor: '#f5f5f5' }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Sales Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            查看並管理您的銷售訂單資料
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="SalesOrder tabs">
          <Tab label="預覽" />
          <Tab label="查詢/修改" />
          <Tab label="新增" />
        </Tabs>
      </Box>

      <TabPanel value={tabIndex} index={0}>
        <PreviewPage />
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <EditPage />
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <CreatePage />
      </TabPanel>
    </Container>
  )
}

export default App