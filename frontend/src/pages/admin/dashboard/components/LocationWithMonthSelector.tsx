import { useState, useEffect, useCallback } from "react";
import { Autocomplete, TextField, Box, IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDistrict, setSelectedTaluka, clearFilters } from "../../../../redux/reducer/dashboardFilterSlice";
import { RootState } from "../../../../redux/store";
import { roundedInputBoxStyle } from "../../../../constant/commonFunctions";
import { RefreshOutlined } from "@mui/icons-material";
import { FetchDistrictTalukaService } from "../../../../utils/services/ngo.registration.service";

const LocationWithMonthSelector = () => {
    const dispatch = useDispatch();
    const { selectedDistrict, selectedTaluka } = useSelector((state: RootState) => state.dashboardFilter);
    const [districts, setDistricts] = useState<string[]>([]);
    const [talukas, setTalukas] = useState<string[]>([]);

    const fetchDistrictList = useCallback(async () => {
        const { code, data } = await FetchDistrictTalukaService({ "slug": "district", state:'Maharashtra' });
        if (code === 200 && data) {
            setDistricts(data);
        }
    }, []);

    const fetchTalukaList = useCallback(async () => {
        if (!districts) return
        const { code, data } = await FetchDistrictTalukaService({ "slug": "taluka", district: selectedDistrict, state: 'Maharashtra' });
        if (code === 200 && data) {
            setTalukas(data);
        }
    }, [selectedDistrict]);

    useEffect(() => {
        fetchDistrictList();
        fetchTalukaList();
    }, [fetchDistrictList, fetchTalukaList]);

    const handleDistrictChange = (event: any, newValue: string | null) => {
        dispatch(setSelectedDistrict(newValue));
        dispatch(setSelectedTaluka(null));
    };

    const handleTalukaChange = (event: any, newValue: string | null) => {
        dispatch(setSelectedTaluka(newValue));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    return (
        <Box display="flex" flexDirection="row" gap={1.5} alignItems="center" maxWidth="100%">
            {/* <MonthSelector /> */}
            <Autocomplete
                options={districts}
                getOptionLabel={(option) => option}
                value={selectedDistrict}
                sx={{ width: 250 }}
                onChange={handleDistrictChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        sx={{ ...roundedInputBoxStyle("38px") }}
                        label="Select District"
                        size="small"
                        InputLabelProps={{
                            className: params.InputLabelProps?.className ?? "",
                            style: params.InputLabelProps?.style ?? {},
                        }}
                    />
                )}
            />
            <Autocomplete
                options={talukas}
                getOptionLabel={(option) => option}
                value={selectedTaluka}
                sx={{ width: 250 }}
                onChange={handleTalukaChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Taluka"
                        size="small"
                        sx={{ ...roundedInputBoxStyle("38px") }}
                        InputLabelProps={{
                            className: params.InputLabelProps?.className ?? "",
                            style: params.InputLabelProps?.style ?? {},
                        }}
                    />
                )}
            />
            <Tooltip title="Reset filters">
                <IconButton
                    onClick={handleClearFilters}
                    color="primary"
                    size="small"
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        "&:hover": { bgcolor: "action.hover" },
                    }}
                >
                    <RefreshOutlined fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box >
    );
};

export default LocationWithMonthSelector;

