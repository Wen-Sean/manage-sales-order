import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, TextField, Box, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const initialPricing = { ConditionType: '', ConditionRateRatio: '', ConditionRateRatioISOUnit: '' };

// 接受 data prop 和 onDataUpdate 函數
export default function CreatePricingPage({ data, onDataUpdate }) {
    // 關鍵修正：狀態初始化來自 data prop
    const [pricings, setPricings] = useState(data);
    
    useEffect(() => {
        setPricings(data);
    }, [data]);
    
    const [nextId, setNextId] = useState(data.length > 0 ? data[data.length - 1].id + 1 : 1);

    const handleAddPricing = () => {
        const newPricings = [...pricings, { id: nextId, ...initialPricing }];
        setPricings(newPricings);
        setNextId(prev => prev + 1);
        // 立即回傳數據 (包含數字轉換)
        const cleanedData = newPricings.map(({ id, ...rest }) => ({ ...rest, ConditionRateRatio: parseFloat(rest.ConditionRateRatio) || 0 }));
        onDataUpdate(cleanedData);
    };

    const handleChange = (id, field, value) => {
        const updatedPricings = pricings.map(p => (p.id === id ? { ...p, [field]: value } : p));
        setPricings(updatedPricings);
        // 立即回傳數據 (包含數字轉換)
        const cleanedData = updatedPricings.map(({ id, ...rest }) => ({ ...rest, ConditionRateRatio: parseFloat(rest.ConditionRateRatio) || 0 }));
        onDataUpdate(cleanedData);
    };

    const handleDelete = (id) => {
        const filteredPricings = pricings.filter(p => p.id !== id);
        setPricings(filteredPricings);
        // 立即回傳數據 (包含數字轉換)
        const cleanedData = filteredPricings.map(({ id, ...rest }) => ({ ...rest, ConditionRateRatio: parseFloat(rest.ConditionRateRatio) || 0 }));
        onDataUpdate(cleanedData);
    };

    const inputWidth = 80;

    return (
        <Box sx={{ p: 1, height: '100%' }}>
            <TableContainer component={Paper} sx={{ height: '150px' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 100 }}>條件類型</TableCell>
                            <TableCell sx={{ width: 100 }}>條件比率</TableCell>
                            <TableCell sx={{ width: 100 }}>單位</TableCell>
                            <TableCell sx={{ width: 60 }}>刪除</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pricings.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <TextField
                                        size="small" variant="standard"
                                        value={p.ConditionType}
                                        onChange={(e) => handleChange(p.id, 'ConditionType', e.target.value)}
                                        sx={{ width: inputWidth }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small" variant="standard"
                                        value={p.ConditionRateRatio}
                                        onChange={(e) => handleChange(p.id, 'ConditionRateRatio', e.target.value)}
                                        sx={{ width: inputWidth }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small" variant="standard"
                                        value={p.ConditionRateRatioISOUnit}
                                        onChange={(e) => handleChange(p.id, 'ConditionRateRatioISOUnit', e.target.value)}
                                        sx={{ width: inputWidth }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton color="error" size="small" onClick={() => handleDelete(p.id)}>
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ mt: 2, textAlign: 'left' }}>
                <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={handleAddPricing} size="small">
                    新增定價元素
                </Button>
            </Box>
        </Box>
    );
}