import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    Card,
    Box,
    Typography,
    Collapse,
    TableCell,
    IconButton,
    Chip,
    SelectChangeEvent,
} from "@mui/material";
import { ExpandMore, Circle } from "@mui/icons-material";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import GlobalDrawerContent from "../GlobalDrawerContent";
import TableHeadList, { HeadCell } from "../../common/table/TableHeadList";
import CommonTableCell from "../../common/table/CommonTableCell";
import dayjs from "dayjs";
import NoDataFound from "../../common/table/NoDataFoundModule";
import TableSkeleton from "../../loader/TableSkeleton";
import CustomPagination from "../../common/table/TablePagination";
import { RootState } from "../../../redux/store";
import { ActivityLog, FloodReportLog } from "../../../utils/dto/response/flood-relief.type";
import { FetchFloodReliefLogsService } from "../../../utils/services/flood.relied.service";
import { FetchFloodReliefLogsRequest } from "../../../utils/dto/request/flood-relief.type";

// Define table headers
const headCells: HeadCell[] = [
    { id: "expand", label: "", width: "50" },
    { id: "created_at", label: "Timestamp", width: "200"},
    { id: "module_type", label: "Module", width: "150"},
    { id: "action", label: "Action", width: "100" },
];

// Fields to exclude from display
const excludedFields = [
    "id",
    "uuid",
    "created_at",
    "created_by",
    "updated_at",
    "updated_by",
    "deleted_at",
    "flood_id",
    "taluka_id",
    "village_id",
    "district_id",
];

// Format labels for display
const formatLabel = (text: string) =>
    text
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

// Determine chip color based on action
const getActionColor = (action: string): "success" | "primary" | "error" => {
    switch (action) {
        case "flood_relief_create": return "success";
        case "flood_relief_update": return "primary";
        case "flood_relief_delete": return "error";
        default: return "primary";
    }
};

// Compare old and new values to identify differences
const compareValues = (before: FloodReportLog | null, after: FloodReportLog | string | Record<string, any>) => {
    const differences: Set<string> = new Set();

    const compareObjects = (obj1: any, obj2: any, prefix: string = "") => {
        const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
        keys.forEach((key) => {
            if (excludedFields.includes(key)) return;

            const value1 = obj1?.[key];
            const value2 = obj2?.[key];

            if (JSON.stringify(value1) !== JSON.stringify(value2)) {
                differences.add(prefix ? `${prefix}${key}` : key);
            }
        });
    };

    if (typeof after === "string") {
        // If new_value is an empty string, compare request with old_value
        compareObjects(before, before);
    } else {
        compareObjects(before, after);
    }

    return differences;
};

// Render nested data with difference highlighting
const renderNestedData = (data: FloodReportLog | string | Record<string, any> | null, differences: Set<string>) => {
    if (!data || typeof data === "string") return <Typography variant="body2">No data available</Typography>;

    return (
        <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
            {Object.entries(data)
                .filter(([key]) => !excludedFields.includes(key))
                .map(([key, value]) => {
                    const isDifferent = differences.has(key);
                    let displayValue = value ?? "N/A";
                    if (
                        key.toLowerCase().includes("date") &&
                        value &&
                        dayjs(value).isValid()
                    ) {
                        displayValue = dayjs(value).format("DD/MM/YYYY");
                    }
                    return (
                        <Box key={key} sx={{ mb: 1 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: "bold", color: isDifferent ? "red" : "inherit" }}
                            >
                                {formatLabel(key)}:
                            </Typography>
                            <Typography variant="body2">{String(displayValue ?? "N/A")}</Typography>
                        </Box>
                    );
                })}
        </Box>
    );
};

interface FloodReliefAuditLogPayload {
    limit: number;
    offset: number;
    totalCount: number;
}

const FloodReliefAuditLog: React.FC = () => {
    const dispatch = useDispatch();
    const { drawerData } = useSelector((state: RootState) => state.drawer);
    const [loading, setLoading] = useState(false);
    const [auditLogs, setAuditLogs] = useState<ActivityLog[]>([]);
    const [payload, setPayload] = useState<FloodReliefAuditLogPayload>({
        limit: 15,
        offset: 0,
        totalCount: 0,
    });
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const fetchAuditLogs = useCallback(async () => {
        if (!drawerData?.uuid) {
            dispatch(showSnackbar({ type: "error", message: "No flood report UUID provided" }));
            return;
        }

        setLoading(true);
        const requestPayload: FetchFloodReliefLogsRequest = {
            uuid: drawerData.uuid,
            limit: payload.limit,
            offset: payload.offset,
            module_type: "flood_relief_report",
            campaign_uuid: "",
        };

        const { code, data, message } = await FetchFloodReliefLogsService(requestPayload);
        if (code === 200 && data) {
            setAuditLogs(data.data);
            setPayload((prev) => ({ ...prev, totalCount: data.total_count }));
        } else {
            setAuditLogs([]);
            setPayload((prev) => ({ ...prev, totalCount: 0 }));
            dispatch(showSnackbar({ type: "error", message: message || "Error fetching audit logs" }));
        }
        setLoading(false);
    }, [dispatch, drawerData?.uuid, payload.limit, payload.offset]);

    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        setPayload((prev) => ({ ...prev, offset: (newPage - 1) * prev.limit }));
    };

    const handleRowsPerPageChange = (event: SelectChangeEvent) => {
        setPayload((prev) => ({ ...prev, limit: parseInt(event.target.value), offset: 0 }));
    };

    const handleExpandClick = (id: number) => {
        setExpandedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const visibleRows = useMemo(() => auditLogs ?? [], [auditLogs]);

    return (
        <GlobalDrawerContent
            drawerBody={
                <Card sx={{ height: '100%' }}>
                    <TableContainer sx={{ minHeight: 'calc(90vh - 140px)', maxHeight: 'calc(90vh - 140px)' }}>
                        {!loading && visibleRows.length > 0 && (
                            <Table stickyHeader size="small" sx={{ minWidth: 500, tableLayout: "fixed" }}>
                                <TableHeadList headCells={headCells} />
                                <TableBody>
                                    {visibleRows.map((row) => {
                                        const beforeValue = row.action === "flood_relief_create" || !row.old_value ? row.request : row.old_value;
                                        const afterValue = row.request;
                                        const beforeLabel = row.action === "flood_relief_create" || !row.old_value ? "Request Value" : "Old Value";
                                        const differences = compareValues(beforeValue, afterValue);

                                        return (
                                            <React.Fragment key={row.id}>
                                                <TableRow>
                                                    <CommonTableCell sx={{ textAlign: 'left' }}

                                                        value={
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleExpandClick(row.id)}
                                                            >
                                                                <ExpandMore
                                                                    sx={{
                                                                        transform: expandedRows.includes(row.id)
                                                                            ? "rotate(180deg)"
                                                                            : "rotate(0deg)",
                                                                        transition: "transform 0.2s",
                                                                    }}
                                                                />
                                                            </IconButton>
                                                        } />
                                                    <CommonTableCell value={dayjs(row.created_at).format('DD/MM/YYYY')} sx={{ textAlign: 'left', position: "sticky", left: 0, background: "white", zIndex: 1 }} />
                                                    <CommonTableCell value={row?.module_type ? formatLabel(row?.module_type) : "-"} sx={{ textAlign: 'left', }} />
                                                    <CommonTableCell sx={{ textAlign: 'left', position: "sticky", left: 350, background: "white", zIndex: 1 }}
                                                        value={<Chip
                                                            label={row.action ? formatLabel(row.action.replace("flood_relief_", "")) : ""}
                                                            color={getActionColor(row.action)}
                                                            size="small"
                                                            icon={<Circle />}
                                                            variant="outlined"
                                                        />} />
                                                </TableRow>
                                                <TableRow>
                                                    <CommonTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}
                                                        value={

                                                            <Collapse in={expandedRows.includes(row.id)} timeout="auto" unmountOnExit>
                                                                <Box sx={{ display: "flex", gap: 2, p: 2 }}>
                                                                    <Box sx={{ flex: 1 }}>
                                                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                                                            {beforeLabel}
                                                                        </Typography>
                                                                        {renderNestedData(beforeValue, differences)}
                                                                    </Box>
                                                                    <Box sx={{ flex: 1 }}>
                                                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                                                            New Value
                                                                        </Typography>
                                                                        {renderNestedData(afterValue, differences)}
                                                                    </Box>
                                                                </Box>
                                                            </Collapse>
                                                        } />
                                                </TableRow>
                                            </React.Fragment>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                        {!loading && visibleRows.length === 0 && <NoDataFound moduleName="Flood Relief Logs" height="50vh" />}
                        {loading && <TableSkeleton rows={15} columns={headCells.length} />}
                    </TableContainer>
                    <CustomPagination
                        count={payload.totalCount || 0}
                        rowsPerPage={payload.limit}
                        page={payload.offset / payload.limit + 1}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPageOptions={[15, 20, 25, 30]}
                    />
                </Card >
            }
            drawerFooter={<></>} // No footer actions required
        />
    );
};

export default FloodReliefAuditLog;
