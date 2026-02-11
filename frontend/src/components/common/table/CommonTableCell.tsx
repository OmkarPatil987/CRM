import { Theme } from '@emotion/react';
import { SxProps, TableCell } from '@mui/material';
import React from 'react';

interface CommonTableCellProps {
    value: React.ReactNode | string | number;
    formatDate?: boolean;
    textOverflow?: boolean;
    dateFormat?: string;
    style?: SxProps<Theme>;
    [key: string]: any;
}

const CommonTableCell = ({ value, formatDate = false, textOverflow = true, dateFormat = 'short', style, ...props  }: CommonTableCellProps) => {
    const formatDateValue = (date: Date | string | number) => {
        const parsedDate = date instanceof Date ? date : new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return 'Invalid Date';
        }

        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        };

        return new Intl.DateTimeFormat('en-GB', options).format(parsedDate);
    };

    const formattedValue = formatDate && (typeof value === 'string' || typeof value === 'number' || value instanceof Date) && (value instanceof Date || !isNaN(new Date(value).getTime()))
        ? formatDateValue(value)
        : value;

    return (
        <TableCell
            sx={{
                overflow: textOverflow ? 'hidden' : 'visible',
                textOverflow: textOverflow ? 'ellipsis' : 'clip',
                whiteSpace: 'nowrap',
                borderRightWidth: 1,
                borderRightStyle: 'solid',
                borderLeftWidth: 1,
                borderLeftStyle: 'solid',
                borderLeftColor: 'grey.300',
                borderRightColor: 'grey.300',
                ...style
            }}
            {...props}
        >

            {formattedValue}
        </TableCell>
    );
};

export default CommonTableCell;
