
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Grid,
    TextField,
    MenuItem,
    InputAdornment
} from '@mui/material';
import {
    CheckOutlined,
    Title,
    Description,
    Schedule,
    Category,
    Link,
    Numbers
} from '@mui/icons-material';

import GlobalDialogContent from '../GlobalDialogContent';
import { RootState } from '../../../redux/store';
import { closeDialog } from '../../../redux/reducer/dialogSlice';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
import { setModuleRefresh } from '../../../redux/reducer/refreshSlice';
import { CreateActivityService, UpdateActivityService } from '../../../utils/services/activity.service';
import { ActivityRelatedType, ActivityStatus, ActivityType } from '../../../utils/dto/activity';

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    type: Yup.string().required('Type is required'),
    description: Yup.string().optional(),
    related_type: Yup.string().required('Related Entity type is required'),
    related_id: Yup.number().required('Related Entity ID is required').positive().integer(),
    scheduled_at: Yup.string().required('Schedule time is required'),
    status: Yup.string().required('Status is required'),
    owner_id: Yup.number().optional().nullable()
});

const ActivityForm = () => {
    const dispatch = useDispatch();
    const { payload } = useSelector((state: RootState) => state.dialog);
    const [loading, setLoading] = useState(false);
    const isEdit = payload?.mode === 'EDIT';
    const activityData = payload?.data;

    const formik = useFormik({
        initialValues: {
            title: activityData?.title || '',
            type: activityData?.type || ActivityType.CALL,
            description: activityData?.description || '',
            related_type: activityData?.related_type || ActivityRelatedType.LEAD,
            related_id: activityData?.related_id || '',
            scheduled_at: activityData?.scheduled_at ? new Date(activityData.scheduled_at).toISOString().slice(0, 16) : '', // Format for datetime-local
            status: activityData?.status || ActivityStatus.PENDING,
            owner_id: activityData?.owner_id || ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                // Convert back to ISO string if needed, or backend handles it. 
                // datetime-local gives "YYYY-MM-DDTHH:mm"
                // Go backend might expect RFC3339.
                const submissionData: any = { ...values };
                if (submissionData.scheduled_at) {
                    submissionData.scheduled_at = new Date(submissionData.scheduled_at).toISOString();
                }

                // Ensure related_id and owner_id are numbers
                submissionData.related_id = Number(submissionData.related_id);
                if (submissionData.owner_id) submissionData.owner_id = Number(submissionData.owner_id);
                else delete submissionData.owner_id;

                let response;
                if (isEdit) {
                    response = await UpdateActivityService({ ...submissionData, id: activityData.id });
                } else {
                    response = await CreateActivityService(submissionData);
                }

                const { code, message } = response;
                if (code === 200) {
                    dispatch(showSnackbar({ type: 'success', message: message || (isEdit ? 'Activity updated successfully' : 'Activity created successfully') }));
                    dispatch(closeDialog());
                    dispatch(setModuleRefresh({ moduleName: 'activity_list', refresh: true }));
                } else {
                    dispatch(showSnackbar({ type: 'error', message: message || 'Operation failed' }));
                }
            } catch (error: any) {
                dispatch(showSnackbar({ type: 'error', message: error.message || 'An error occurred' }));
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <GlobalDialogContent
            dialogBody={
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="title"
                            label="Title *"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && !!formik.errors.title}
                            helperText={formik.touched.title && (formik.errors.title as string)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Title fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            name="type"
                            label="Type *"
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.type && !!formik.errors.type}
                            helperText={formik.touched.type && (formik.errors.type as string)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Category fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            {Object.values(ActivityType).map((type) => (
                                <MenuItem key={type} value={type} sx={{ textTransform: 'capitalize' }}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            type="datetime-local"
                            fullWidth
                            name="scheduled_at"
                            label="Scheduled At *"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.scheduled_at}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.scheduled_at && !!formik.errors.scheduled_at}
                            helperText={formik.touched.scheduled_at && (formik.errors.scheduled_at as string)}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            name="related_type"
                            label="Related Type *"
                            value={formik.values.related_type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.related_type && !!formik.errors.related_type}
                            helperText={formik.touched.related_type && (formik.errors.related_type as string)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Link fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            {Object.values(ActivityRelatedType).map((type) => (
                                <MenuItem key={type} value={type} sx={{ textTransform: 'capitalize' }}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            type="number"
                            fullWidth
                            name="related_id"
                            label="Related Entity ID *"
                            value={formik.values.related_id}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.related_id && !!formik.errors.related_id}
                            helperText={formik.touched.related_id && (formik.errors.related_id as string)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Numbers fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            name="status"
                            label="Status *"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.status && !!formik.errors.status}
                            helperText={formik.touched.status && (formik.errors.status as string)}
                        >
                            {Object.values(ActivityStatus).map((status) => (
                                <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            name="description"
                            label="Description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && !!formik.errors.description}
                            helperText={formik.touched.description && (formik.errors.description as string)}
                        />
                    </Grid>
                </Grid>
            }
            dialogFooter={
                <Button
                    onClick={() => formik.handleSubmit()}
                    variant="contained"
                    color="primary"
                    startIcon={<CheckOutlined />}
                    disabled={loading}
                >
                    {isEdit ? 'Update' : 'Create'}
                </Button>
            }
        />
    );
};

export default ActivityForm;
