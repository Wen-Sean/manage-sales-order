import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, TextField, Box, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const initialText = { Language: '', LongTextID: '', LongText: '' };

// 接受 data prop 和 onDataUpdate 函數
export default function CreateTextPage({ data, onDataUpdate }) {
    // 關鍵修正：狀態初始化來自 data prop
    const [texts, setTexts] = useState(data);

    useEffect(() => {
        setTexts(data);
    }, [data]);
    
    const [nextId, setNextId] = useState(data.length > 0 ? data[data.length - 1].id + 1 : 1);

    const handleAddText = () => {
        const newTexts = [...texts, { id: nextId, ...initialText }];
        setTexts(newTexts);
        setNextId(prev => prev + 1);
        onDataUpdate(newTexts.map(({ id, ...rest }) => rest)); // 立即回傳數據
    };

    const handleChange = (id, field, value) => {
        const updatedTexts = texts.map(t => (t.id === id ? { ...t, [field]: value } : t));
        setTexts(updatedTexts);
        onDataUpdate(updatedTexts.map(({ id, ...rest }) => rest)); // 立即回傳數據
    };

    const handleDelete = (id) => {
        const filteredTexts = texts.filter(t => t.id !== id);
        setTexts(filteredTexts);
        onDataUpdate(filteredTexts.map(({ id, ...rest }) => rest)); // 立即回傳數據
    };

    const inputWidth = 80;

    return (
        <Box sx={{ p: 1, height: '100%' }}>
            <TableContainer component={Paper} sx={{ height: '150px' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 80 }}>語言</TableCell>
                            <TableCell sx={{ width: 100 }}>內文類型</TableCell>
                            <TableCell sx={{ width: 300 }}>內文內容</TableCell>
                            <TableCell sx={{ width: 60 }}>刪除</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {texts.map((t) => (
                            <TableRow key={t.id}>
                                <TableCell>
                                    <TextField size="small" variant="standard" value={t.Language} onChange={(e) => handleChange(t.id, 'Language', e.target.value)} sx={{ width: 60 }} />
                                </TableCell>
                                <TableCell>
                                    <TextField size="small" variant="standard" value={t.LongTextID} onChange={(e) => handleChange(t.id, 'LongTextID', e.target.value)} sx={{ width: inputWidth }} />
                                </TableCell>
                                <TableCell>
                                    <TextField 
                                        size="small" 
                                        variant="standard" 
                                        multiline 
                                        rows={1}
                                        value={t.LongText} 
                                        onChange={(e) => handleChange(t.id, 'LongText', e.target.value)} 
                                        sx={{ width: 280 }} 
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton color="error" size="small" onClick={() => handleDelete(t.id)}>
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ mt: 2, textAlign: 'left' }}>
                <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={handleAddText} size="small">
                    新增內文
                </Button>
            </Box>
        </Box>
    );
}