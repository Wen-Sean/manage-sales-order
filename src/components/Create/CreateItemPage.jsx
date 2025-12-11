import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, TextField, Box, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// 預設的空行項目結構
const initialItem = {
    Product: '',
    RequestedQuantity: '',
    RequestedQuantityISOUnit: '', 
};

// 接受 data prop 和 onDataUpdate 函數
export default function CreateItemPage({ data, onDataUpdate }) {
    // 關鍵修正：狀態初始化來自 data prop
    const [items, setItems] = useState(data); 

    // 使用 useEffect 確保父組件傳入 data 變更時，子組件更新
    useEffect(() => {
        setItems(data);
    }, [data]);
    
    // 修正：nextId 從 1 開始，或根據現有數據長度初始化
    const [nextId, setNextId] = useState(data.length > 0 ? data[data.length - 1].id + 1 : 1);

    // 在所有變更函數中，都必須呼叫 onDataUpdate()
    const handleAddItem = () => {
        const newItems = [...items, { id: nextId, ...initialItem }];
        setItems(newItems);
        setNextId(prevId => prevId + 1);
        onDataUpdate(newItems); 
    };

    const handleChange = (id, field, value) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setItems(updatedItems);
        onDataUpdate(updatedItems); 
    };

    const handleDeleteItem = (id) => {
        const filteredItems = items.filter(item => item.id !== id);
        setItems(filteredItems);
        onDataUpdate(filteredItems);
    };

    const inputProductWidth = 120;
    const inputQtyUnitWidth = 80;

    return (
        <Box sx={{ p: 1, height: '100%'}}>
            <TableContainer component={Paper} sx={{ height: '200px' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 80 }}>項目編號</TableCell>
                            <TableCell sx={{ width: inputProductWidth + 20 }}>物料號碼</TableCell>
                            <TableCell sx={{ width: inputQtyUnitWidth + 20 }}>數量</TableCell> 
                            <TableCell sx={{ width: inputQtyUnitWidth + 20 }}>單位</TableCell>
                            <TableCell sx={{ width: 60 }}>刪除</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{(index + 1) * 10}</TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        variant="standard"
                                        value={item.Product}
                                        onChange={(e) => handleChange(item.id, 'Product', e.target.value)}
                                        sx={{ width: inputProductWidth }} 
                                    />
                                </TableCell>
                                <TableCell> 
                                    <TextField
                                        size="small"
                                        variant="standard"
                                        value={item.RequestedQuantity} 
                                        onChange={(e) => handleChange(item.id, 'RequestedQuantity', e.target.value)}
                                        sx={{ width: inputQtyUnitWidth }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        variant="standard"
                                        value={item.RequestedQuantityISOUnit}
                                        onChange={(e) => handleChange(item.id, 'RequestedQuantityISOUnit', e.target.value)}
                                        sx={{ width: inputQtyUnitWidth }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton 
                                        color="error" 
                                        size="small"
                                        onClick={() => handleDeleteItem(item.id)}
                                    >
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <Box sx={{ mt: 2, textAlign: 'left' }}>
                <Button
                    variant="outlined"
                    startIcon={<AddCircleIcon />}
                    onClick={handleAddItem}
                    size="small"
                >
                    新增項目
                </Button>
            </Box>
        </Box>
    );
}