import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, TextField, Box, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const initialPartner = { PartnerFunction: '', Customer: '' };

// 接受 data prop 和 onDataUpdate 函數
export default function CreatePartnerPage({ data, onDataUpdate }) {
    // 關鍵修正：狀態初始化來自 data prop
    const [partners, setPartners] = useState(data);

    useEffect(() => {
        setPartners(data);
    }, [data]);
    
    const [nextId, setNextId] = useState(data.length > 0 ? data[data.length - 1].id + 1 : 1);

    const handleAddPartner = () => {
        const newPartners = [...partners, { id: nextId, ...initialPartner }];
        setPartners(newPartners);
        setNextId(prev => prev + 1);
        onDataUpdate(newPartners.map(({ id, ...rest }) => rest)); // 立即回傳數據
    };

    const handleChange = (id, field, value) => {
        const updatedPartners = partners.map(p => (p.id === id ? { ...p, [field]: value } : p));
        setPartners(updatedPartners);
        onDataUpdate(updatedPartners.map(({ id, ...rest }) => rest)); // 立即回傳數據
    };

    const handleDelete = (id) => {
        const filteredPartners = partners.filter(p => p.id !== id);
        setPartners(filteredPartners);
        onDataUpdate(filteredPartners.map(({ id, ...rest }) => rest)); // 立即回傳數據
    };

    const inputWidth = 100;

    return (
        <Box sx={{ p: 1, height: '100%' }}>
            <TableContainer component={Paper} sx={{ height: '150px' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 120 }}>夥伴功能</TableCell>
                            <TableCell sx={{ width: 150 }}>客戶號碼</TableCell>
                            <TableCell sx={{ width: 60 }}>刪除</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {partners.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <TextField
                                        size="small" variant="standard"
                                        value={p.PartnerFunction}
                                        onChange={(e) => handleChange(p.id, 'PartnerFunction', e.target.value)}
                                        sx={{ width: inputWidth }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small" variant="standard"
                                        value={p.Customer}
                                        onChange={(e) => handleChange(p.id, 'Customer', e.target.value)}
                                        sx={{ width: inputWidth + 30 }}
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
                <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={handleAddPartner} size="small">
                    新增夥伴
                </Button>
            </Box>
        </Box>
    );
}