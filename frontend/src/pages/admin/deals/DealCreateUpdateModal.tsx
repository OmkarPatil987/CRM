import React, { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    IconButton,
    MenuItem,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { DealCreateRequest, DealUpdateRequest } from '../../../utils/dto/request/deal'

interface DealCreateUpdateModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (values: DealCreateRequest | DealUpdateRequest) => Promise<void>
    initialValues?: DealUpdateRequest
    isEdit?: boolean
}

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    amount: Yup.number().min(0, 'Amount must be positive'),
    stage: Yup.string().required('Stage is required'),
})

const DealCreateUpdateModal: React.FC<DealCreateUpdateModalProps> = ({
    open,
    onClose,
    onSubmit,
    initialValues,
    isEdit = false,
}) => {
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            title: initialValues?.title || '',
            description: initialValues?.description || '',
            amount: initialValues?.amount || 0,
            stage: initialValues?.stage || 'New',
            status: initialValues?.status || 'Open',
            probability: initialValues?.probability || 0,
            expected_close_date: initialValues?.expected_close_date || '',
            contact_id: initialValues?.contact_id || undefined,
            lead_id: initialValues?.lead_id || undefined,
            owner_id: initialValues?.owner_id || undefined,
            notes: initialValues?.notes || '',
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const payload = isEdit && initialValues?.id
                    ? { ...values, id: initialValues.id } as DealUpdateRequest
                    : values as DealCreateRequest
                await onSubmit(payload)
                onClose()
                formik.resetForm()
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        },
    })

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <div className="flex items-center justify-between">
                    <span>{isEdit ? 'Edit Deal' : 'Create Deal'}</span>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent dividers>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="title"
                                name="title"
                                label="Deal Title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="amount"
                                name="amount"
                                type="number"
                                label="Amount"
                                value={formik.values.amount}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="probability"
                                name="probability"
                                type="number"
                                label="Probability (%)"
                                value={formik.values.probability}
                                onChange={formik.handleChange}
                                InputProps={{ inputProps: { min: 0, max: 100 } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                id="stage"
                                name="stage"
                                label="Stage"
                                value={formik.values.stage}
                                onChange={formik.handleChange}
                            >
                                {['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="expected_close_date"
                                name="expected_close_date"
                                label="Expected Close Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formik.values.expected_close_date}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                id="status"
                                name="status"
                                label="Status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                            >
                                {['Open', 'Won', 'Lost'].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {/* Placeholder for Linked Contact - using simple ID input for now */}
                            <TextField
                                fullWidth
                                id="contact_id"
                                name="contact_id"
                                label="Contact ID"
                                type="number"
                                value={formik.values.contact_id || ''}
                                onChange={formik.handleChange}
                                helperText="Enter ID of linked contact"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="notes"
                                name="notes"
                                label="Notes"
                                multiline
                                rows={3}
                                value={formik.values.notes}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={() => formik.handleSubmit()}
                    variant="contained"
                    disabled={loading}
                >
                    {isEdit ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DealCreateUpdateModal
