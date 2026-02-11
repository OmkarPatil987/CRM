import React from 'react';
import {
    Pagination,
    Grid,
    Select,
    MenuItem,
    SelectChangeEvent,
    Chip
} from '@mui/material';
import { FilterListOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import useResponsive from '../../../hooks/useResponsive';

interface CustomPaginationProps {
    count: number;
    rowsPerPage: number;
    page: number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
    onRowsPerPageChange: (event: SelectChangeEvent) => void;
    rowsPerPageOptions?: number[];
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
    count,
    rowsPerPage,
    page,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [15, 20, 30, 50, 100],
}) => {
    const totalPages = Math.ceil(count / rowsPerPage);
    const { isMobile } = useResponsive()
    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
                <Chip
                    size="medium"
                    color="primary"
                    icon={<FilterListOutlined color="primary" fontSize="small" />}
                    label={
                        `${count} Results Found`
                    }
                    variant="outlined"
                    sx={{
                        borderRadius: '8px',
                        fontWeight: 500,
                        px: 1,
                        ml:1
                    }}
                />
            </Grid>

            <Grid item xs={12} sm={8} container justifyContent="flex-end" alignItems="center" wrap="nowrap"  spacing={1}>
                <Grid item>
                    <Select
                        sx={{ mr: 1 }}
                        value={rowsPerPage.toString()}
                        onChange={onRowsPerPageChange}
                        size="small"
                    >
                        {rowsPerPageOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={onPageChange}
                        color="primary"
                        variant="outlined"
                        siblingCount={isMobile ? 0 : 1}
                        boundaryCount={isMobile ? 1 : 2}
                        shape="rounded"
                        size="medium"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                transition: "all 0.3s ease",
                            },
                            "& .MuiPaginationItem-root:hover": {
                                backgroundColor: "#f0f0f0",
                            },
                            "& .Mui-selected": {
                                backgroundColor: "#1976d2",
                                color: "#fff",
                                fontWeight: "bold",
                                border: "none",
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CustomPagination;
