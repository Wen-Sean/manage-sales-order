import { use, useState } from 'react';
import { Box, Paper, TextField, Button } from '@mui/material';
import { updateSalesOrder } from '../api/salesorders';
import Alert from '@mui/material/Alert';

export default function EditPage({ row, onClose, onUpdated, status }) {
  const id = row.SalesOrder;
  const [formData, setFormData] = useState(row);
  const [modifiedFields, setModifiedFields] = useState({}); // 追蹤修改過的欄位
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 只記錄真正有修改的欄位
    if (value !== row[field]) {
      setModifiedFields((prev) => ({ ...prev, [field]: value }));
    } else {
      // 如果改回原值，從修改記錄中移除
      setModifiedFields((prev) => {
        const newModified = { ...prev };
        delete newModified[field];
        return newModified;
      });
    }
  };

  const handleSave = async () => {
    // 如果沒有修改任何欄位，直接關閉
    if (Object.keys(modifiedFields).length === 0) {
      status('noChange')
      //alert('沒有任何修改');
      onClose();
      return;
    }

    setSaving(true);
    try {
      console.log('只傳送修改過的欄位:', modifiedFields);
      await updateSalesOrder(id, modifiedFields);
      status('success');
      //alert('修改成功');
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      status('failed');
      onClose();
      //alert('修改失敗');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="SalesOrder"
          value={formData.SalesOrder || ''}
          disabled
        />
        <TextField
          label="SalesOrderType"
          value={formData.SoldToParty || ''}
          disabled
        />
        <TextField
          label="SoldToParty"
          value={formData.SoldToParty || ''}
          onChange={(e) => handleChange('SoldToParty', e.target.value)}
        />
        <TextField
          label="SalesOrganization"
          value={formData.SalesOrganization || ''}
          onChange={(e) => handleChange('SalesOrganization', e.target.value)}
        />
        <TextField
          label="DistributionChannel"
          value={formData.DistributionChannel || ''}
          onChange={(e) => handleChange('DistributionChannel', e.target.value)}
        />
        <TextField
          label="OrganizationDivision"
          value={formData.OrganizationDivision || ''}
          onChange={(e) => handleChange('OrganizationDivision', e.target.value)}
        />
        <TextField
          label="PurchaseOrderByCustomer"
          value={formData.PurchaseOrderByCustomer || ''}
          onChange={(e) => handleChange('PurchaseOrderByCustomer', e.target.value)}
        />
        <TextField
          label="CompleteDeliveryIsDefined"
          value={formData.CompleteDeliveryIsDefined || ''}
          onChange={(e) => handleChange('CompleteDeliveryIsDefined', e.target.value)}
        />
        <TextField
          label="SalesOrderDate"
          value={formData.SalesOrderDate || ''}
          onChange={(e) => handleChange('SalesOrderDate', e.target.value)}
        />
        <TextField
          label="RequestedDeliveryDate"
          value={formData.RequestedDeliveryDate || ''}
          onChange={(e) => handleChange('RequestedDeliveryDate', e.target.value)}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? '儲存中...' : '儲存'}
          </Button>
          <Button variant="outlined" onClick={onClose} disabled={saving}>
            取消
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}