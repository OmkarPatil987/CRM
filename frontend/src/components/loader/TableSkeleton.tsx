import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Skeleton
} from "@mui/material";

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 10, columns = 6 }) => {
    const columnWidths = Array.from({ length: columns }, () => `${100 / columns}%`);

    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 2,
                boxShadow: 2,
                overflow: "hidden",
                backgroundColor: "#f9f9f9"
            }}
        >
            <Table sx={{ minWidth: 650 }} stickyHeader>
                <TableHead>
                    <TableRow sx={{ height: 40 }}>
                        {Array.from({ length: columns }).map((_, index) => (
                            <TableCell
                                key={`head-${index}` + 1}
                                sx={{
                                    width: columnWidths[index] || "auto",
                                    paddingY: 0.5
                                }}
                            >
                                <Skeleton height={20} />
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <TableRow key={rowIndex + `row-${rowIndex}`} hover sx={{ height: 40 }}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <TableCell
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    sx={{
                                        width: columnWidths[colIndex] || "auto",
                                        paddingY: 1.25
                                    }}
                                >
                                    <Skeleton
                                        variant="rectangular"
                                        width="100%"
                                        height={20}
                                        sx={{ borderRadius: 1 }}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableSkeleton;
