import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Grid,
    IconButton,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ContactCreateRequest, ContactUpdateRequest } from '../../../utils/dto/request/contact'

interface ContactCreateUpdateModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (values: ContactCreateRequest | ContactUpdateRequest) => Promise<void>
    initialValues?: ContactUpdateRequest
    isEdit?: boolean
}

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    mobile: Yup.string().required('Mobile is required'),
    email: Yup.string().email('Invalid email address'),
})

const ContactCreateUpdateModal: React.FC<ContactCreateUpdateModalProps> = ({
    open,
    onClose,
    onSubmit,
    initialValues,
    isEdit = false,
}) => {
    const [loading, setLoading] = useState(false)

    const formik = useFormik({
        initialValues: {
            name: initialValues?.name || '',
            mobile: initialValues?.mobile || '',
            email: initialValues?.email || '',
            company: initialValues?.company || '',
            designation: initialValues?.designation || '', // job_title alias
            address: initialValues?.address || '',
            tags: initialValues?.tags || '',
            owner_id: initialValues?.owner_id || undefined,
            notes: initialValues?.notes || '',
            // Add other fields as needed
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const payload = isEdit && initialValues?.id
                    ? { ...values, id: initialValues.id } as ContactUpdateRequest
                    : values as ContactCreateRequest
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
                    <span>{isEdit ? 'Edit Contact' : 'Create Contact'}</span>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent dividers>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Full Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="mobile"
                                name="mobile"
                                label="Mobile Number"
                                value={formik.values.mobile}
                                onChange={formik.handleChange}
                                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                helperText={formik.touched.mobile && formik.errors.mobile}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="company"
                                name="company"
                                label="Company"
                                value={formik.values.company}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="designation"
                                name="designation"
                                label="Job Title"
                                value={formik.values.designation}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="address"
                                name="address"
                                label="Address"
                                multiline
                                rows={2}
                                value={formik.values.address}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="tags"
                                name="tags"
                                label="Tags (comma separated)"
                                value={formik.values.tags}
                                onChange={formik.handleChange}
                                helperText="e.g. VIP, Hot Lead"
                            />
                        </Grid>
                        {/* Owner Dropdown - For now simple text input or hardcoded until User List is available */}
                        {/* Linked Lead/Deal - Skipped for now or simple ID input */}
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

export default ContactCreateUpdateModal
