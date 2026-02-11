import { Box, TableCell, TableHead, TableRow } from '@mui/material';
import useResponsive from '../../../hooks/useResponsive';

export interface HeadCell {
    id: string;
    label: string;
    disablePadding?: boolean;
    numeric?: boolean;
    width?: string;
    isSorting?: boolean;
    isSticky?: {
        position: "left" | "right";
        positionStart: string;
        zIndex?: number;
    };
}

interface TableHeadListProps {
    headCells: HeadCell[];
}

const TableHeadList = ({ headCells }: TableHeadListProps) => {
    const { isMobile } = useResponsive();
    return (
        <TableHead sx={{ position: "sticky", top: 0, zIndex: 5, backgroundColor: "#ffffff", }} >
            <TableRow sx={{ position: "sticky", top: 0, backgroundColor: "#cde2f8", zIndex: 4 }}>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        sx={{
                            borderRightWidth: 1,
                            py:1,
                            borderRightStyle: "solid",
                            borderRightColor: "grey.300",
                            bgcolor: "#cde2f8",
                            padding: headCell.disablePadding ? "none" : "normal",
                            width: headCell.width,
                            ...(headCell.isSticky && {
                                position: isMobile ? 'relative' : "sticky",
                                [headCell.isSticky.position]: headCell.isSticky.positionStart || 0,
                                zIndex: headCell.isSticky.zIndex ?? 5,
                            }),
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box sx={{ whiteSpace: 'nowrap' }}>{headCell.label}</Box>
                        </Box>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>

    );
};

export default TableHeadList;
