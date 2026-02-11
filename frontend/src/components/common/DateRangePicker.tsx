import React, { useEffect } from 'react';
import { Box, SxProps, useMediaQuery } from '@mui/material';
import { DatePicker, MobileDatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dayjs } from 'dayjs';

interface DateRangePickerProps {
  onChange: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
  resetTrigger?: boolean;
  datePickerStyles?: SxProps;
  boxStyles?: SxProps;
  inputStyles?: React.CSSProperties;
  startDatePickerProps?: Partial<DatePickerProps<Dayjs>>;
  endDatePickerProps?: Partial<DatePickerProps<Dayjs>>;
  startDate?: Dayjs | null; // Added to receive value from Redux
  endDate?: Dayjs | null; // Added to receive value from Redux
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onChange,
  resetTrigger,
  datePickerStyles,
  boxStyles,
  inputStyles,
  startDatePickerProps = {},
  endDatePickerProps = {},
  startDate: externalStartDate,
  endDate: externalEndDate,
}) => {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(externalStartDate || null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(externalEndDate || null);
  const isMobile = useMediaQuery('(max-width:600px)');

  // Sync internal state with external props (from Redux)
  React.useEffect(() => {
    setStartDate(externalStartDate || null);
    setEndDate(externalEndDate || null);
  }, [externalStartDate, externalEndDate]);

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
    if (date && endDate && date.isAfter(endDate)) {
      setEndDate(null);
    }
    onChange(date, date && endDate && date.isAfter(endDate) ? null : endDate);
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    setEndDate(date);
    onChange(startDate, date);
  };

  useEffect(() => {
    if (resetTrigger) {
      setStartDate(null);
      setEndDate(null);
      onChange(null, null);
    }
  }, [resetTrigger, onChange]);

  const DatePickerComponent = isMobile ? MobileDatePicker : DatePicker;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" alignItems="center" sx={boxStyles || {}}>
        <DatePickerComponent
          {...startDatePickerProps}
          sx={{ '.MuiButtonBase-root': { marginRight: 0 } }}

          format="DD-MM-YYYY"
          value={startDate}
          onChange={handleStartDateChange}
          slotProps={{
            textField: {
              placeholder: 'Start Date',
              fullWidth: true,
              label: 'Start Date',
              size:"small",
              inputProps: {
                style: { textOverflow: 'ellipsis', WebkitTextFillColor: 'black', ...inputStyles },
              },
            },
          }}
        />
        <Box mx={1} sx={{ fontSize: '0.875rem' }}>
          to
        </Box>
        <DatePickerComponent
          {...endDatePickerProps}
          sx={{ '.MuiButtonBase-root': { marginRight: 0 } }}

          value={endDate}
        //   minDate={startDate}
          onChange={handleEndDateChange}
       
          format="DD-MM-YYYY"
          slotProps={{
            textField: {
              placeholder: 'End Date',
              label: 'End Date',
              fullWidth: true,
              size:"small",

              inputProps: {
                style: { textOverflow: 'ellipsis', WebkitTextFillColor: 'black', ...inputStyles },
              },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;