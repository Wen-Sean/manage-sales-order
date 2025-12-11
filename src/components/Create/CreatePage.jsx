import { createSalesOrder } from '../../api/salesorders';
import TextField from '@mui/material/TextField';
import { Box, Tab, Tabs, Button } from '@mui/material';
import { useState, useCallback, useRef } from 'react'
import CreateItemPage from './CreateItemPage'
import CreatePartnerPage from './CreatePartnerPage';
import CreatePricingPage from './CreatePricingPage';
import CreateTextPage from './CreateTextPage';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

function TabPanel({ children, value, index }) {
  // 使用 hidden 屬性隱藏，避免組件被卸載 (Unmount)，從而保留其狀態
  return (
    <div role="tabpanel" hidden={value !== index}>
      <Box sx={{ py: 2 }}>
        {children} 
      </Box>
    </div>
  )
}

// 標頭初始狀態 (作為重置的目標)
const initialHeaderState = {
    SalesOrderType: '',
    SoldToParty: '',
    SalesOrganization: '',
    DistributionChannel: '',
    OrganizationDivision: '',
    PurchaseOrderByCustomer: '',
    CompleteDeliveryIsDefined: '',
};

export default function CreatePage() {
    const [tabIndex, setTabIndex] = useState(0);
    const [headerData, setHeaderData] = useState(initialHeaderState);
    
    const [itemData, setItemData] = useState([]);
    const [partnerData, setPartnerData] = useState([]);
    const [pricingData, setPricingData] = useState([]);
    const [textData, setTextData] = useState([]);
    const [open, setOpen] = useState(false);
    const [newStatus, setNewStatus] = useState();
    const [SoId, setSoId] = useState();
    const [CDIsDefined, setCDIsDefined] = useState();

    // 處理標頭欄位變更
    const handleHeaderChange = (e) => {
        const { id, value } = e.target;
        //let newValue = (id === 'CompleteDeliveryIsDefined') ? (value === 'true') : value;
        setHeaderData(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleCDChange = (e) => {
        const { value } = e.target.value;
        const { id } = "CompleteDeliveryIsDefined";
        setCDIsDefined(value);
        headerData.CompleteDeliveryIsDefined = value;
        setHeaderData(prev => ({
            ...prev,
            [id]: value,
        }));
    }

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue)
    };

    // 處理子組件數據更新的回調函數
    const updateNestedData = useCallback((key, data) => {
        switch (key) {
            case '_Item':
                setItemData(data);
                break;
            case '_Partner':
                setPartnerData(data);
                break;
            case '_PricingElement':
                setPricingData(data);
                break;
            case '_Text':
                setTextData(data);
                break;
            default:
                break;
        }
    }, []);

    // **新增：重置所有狀態的函數**
    const resetForm = () => {
        setHeaderData(initialHeaderState);
        setItemData([]);
        setPartnerData([]);
        setPricingData([]);
        setTextData([]);
        setTabIndex(0); // 重置到第一個 Tab (項目)
    };

    // 建立銷售訂單的主函數
    const handleSubmit = async () => {
        const payload = {
            ...headerData,
            //CompleteDeliveryIsDefined: headerData.CompleteDeliveryIsDefined.toLowerCase() === 'true',
            
            _Item: itemData.map(item => ({
                Product: item.Product,
                RequestedQuantity: parseFloat(item.RequestedQuantity) || 0, 
                RequestedQuantityISOUnit: item.RequestedQuantityISOUnit,
            })).filter(item => item.Product), 
            
            _Partner: partnerData,
            _PricingElement: pricingData,
            _Text: textData,
        };
        console.log(payload);

        try {
            const response = await createSalesOrder(payload);
            //alert(`訂單建立成功！Sales Order ID: ${response.SalesOrder}`);
            setNewStatus('success');
            setSoId(response.SalesOrder)
            setOpen(true);
            
            // 關鍵修正：建立成功後重置表單
            resetForm(); 

        } catch (error) {
            console.error("建立訂單失敗:", error);
            //alert(`建立訂單失敗: ${error.message || '請檢查控制台。'}`);
            setNewStatus('failed');
            setOpen(true);
        }
    };

    return (
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
                    修改成功 訂單號碼: {SoId}
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

            <TextField
            id="SalesOrderType" 
            label="銷售訂單類型" 
            size="small"
            value={headerData.SalesOrderType}
            onChange={handleHeaderChange}
            sx={{ mr: 1, mb: 1 }}
            />
            <TextField
            id="SoldToParty" 
            label="買方號碼" 
            size="small"
            value={headerData.SoldToParty}
            onChange={handleHeaderChange}
            sx={{ mr: 1, mb: 1 }}
            />
            <TextField
            id="SalesOrganization" 
            label="銷售組織" 
            size="small"
            value={headerData.SalesOrganization}
            onChange={handleHeaderChange}
            sx={{ mr: 1, mb: 1 }}
            />
            <TextField
            id="DistributionChannel" 
            label="配銷通路" 
            size="small"
            value={headerData.DistributionChannel}
            onChange={handleHeaderChange}
            sx={{ mr: 1, mb: 1 }}
            />
            <TextField
            id="OrganizationDivision" 
            label="產品部門" 
            size="small"
            value={headerData.OrganizationDivision}
            onChange={handleHeaderChange}
            sx={{ mr: 1, mb: 1 }}
            />
            <TextField
            id="PurchaseOrderByCustomer" 
            label="客戶採購單號碼" 
            size="small"
            value={headerData.PurchaseOrderByCustomer}
            onChange={handleHeaderChange}
            sx={{ mr: 1, mb: 1 }}
            />
            {/* <TextField
            id="CompleteDeliveryIsDefined" 
            label="完全交貨 (true/false)" 
            size="small"
            value={headerData.CompleteDeliveryIsDefined}
            onChange={handleHeaderChange}
            sx={{ mr: 1, mb: 1 }}
            /> */}
            <FormControl sx={{ mr: 1, mb: 1, width: 100 }}>
                <InputLabel id="CompleteDeliveryIsDefinedLabel">完全交貨</InputLabel>
                <Select
                labelId="CompleteDeliveryIsDefinedLabel"
                id="CompleteDeliveryIsDefined"
                value={CDIsDefined}
                label="完全交貨"
                onChange={handleCDChange}
                size="small"
                >
                <MenuItem value={true}>是</MenuItem>
                <MenuItem value={false}>否</MenuItem>
                </Select>
            </FormControl>


            <Box sx={{ margin: 'auto', 
                       border: '1px solid', 
                       borderRadius: 1, 
                       borderColor: '#DCDCDC',
                       p: 1,
                       height: '50vh' }}>

                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="SalesOrder tabs">
                    <Tab label="項目" />
                    <Tab label="夥伴" />
                    <Tab label="定價元素" />
                    <Tab label="內文" />
                </Tabs>

                <TabPanel value={tabIndex} index={0}>
                    <CreateItemPage 
                        data={itemData} 
                        onDataUpdate={(data) => updateNestedData('_Item', data)} 
                    />
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <CreatePartnerPage 
                        data={partnerData} 
                        onDataUpdate={(data) => updateNestedData('_Partner', data)} 
                    />
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <CreatePricingPage 
                        data={pricingData} 
                        onDataUpdate={(data) => updateNestedData('_PricingElement', data)} 
                    />
                </TabPanel>
                <TabPanel value={tabIndex} index={3}>
                    <CreateTextPage 
                        data={textData} 
                        onDataUpdate={(data) => updateNestedData('_Text', data)} 
                    />
                </TabPanel>
            </Box>

            {/* 建立按鈕 */}
            <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    建立銷售訂單
                </Button>
            </Box>
        </Box>
    )
}