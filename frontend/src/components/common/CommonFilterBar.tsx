import React, { useEffect, useCallback, useState } from 'react';
import { Box, Grid, TextField, Autocomplete, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
    setSearchTerm,
    setDistrictId,
    setTalukaId,
    setVillageId,
    clearFilters // Import the clearFilters action
} from '../../redux/reducer/CommonFilterSlice'; // Adjust the import path
import { RootState } from '../../redux/store'; // Adjust the import path
import { FetchDistrictListService, FetchTalukaListService, FetchVillageListService } from '../../utils/services/flood.relied.service';

// Define types for the location data
interface LocationOption {
    id: number;
    name: string;
}

const SearchFilterBar: React.FC<{ searchLabel?: string }> = ({ searchLabel = 'Search...' }) => {
    const dispatch = useDispatch();
    const { district_id, taluka_id, village_id, searchTerm } = useSelector((state: RootState) => state.filters);

    const [districts, setDistricts] = useState<LocationOption[]>([]);
    const [talukas, setTalukas] = useState<LocationOption[]>([]);
    const [villages, setVillages] = useState<LocationOption[]>([]);
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // --- Data Fetching Callbacks ---
    const fetchDistricts = useCallback(async () => {
        const { code, data } = await FetchDistrictListService({ limit: 40, offset: 0 });
        if (code === 200 && data?.data) setDistricts(data.data);
    }, []);

    const fetchTalukas = useCallback(async (id: number) => {
        const { code, data } = await FetchTalukaListService({ district_id: id, limit: 100, offset: 0 });
        if (code === 200 && data?.data) setTalukas(data.data);
        else setTalukas([]);
    }, []);

    const fetchVillages = useCallback(async (id: number) => {
        const { code, data } = await FetchVillageListService({ taluka_id: id, limit: 100, offset: 0 });
        if (code === 200 && data?.data) setVillages(data.data);
        else setVillages([]);
    }, []);

    // --- Effects for Cascading Logic ---
    useEffect(() => {
        fetchDistricts();
    }, [fetchDistricts]);

    useEffect(() => {
        if (district_id) {
            fetchTalukas(district_id);
            setTalukas([]);
            setVillages([]);
        } else {
            // Clear everything if district is cleared
            setTalukas([]);
            setVillages([]);
        }
    }, [district_id, fetchTalukas]);

    useEffect(() => {
        if (taluka_id) {
            fetchVillages(taluka_id);
            setVillages([]);
        } else {
            // Clear villages if taluka is cleared
            setVillages([]);
        }
    }, [taluka_id, fetchVillages]);

    // --- Debounced Search ---
    useEffect(() => {
        const handler = setTimeout(() => {
            dispatch(setSearchTerm(localSearchTerm));
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [localSearchTerm, dispatch]);

    // Reset local search term when global state is cleared
    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    // --- Reset Filters Handler ---
    const handleResetFilters = () => {
        dispatch(clearFilters());
    };

    return (
        <Box sx={{ p: 1, borderBottom: 1, borderColor: 'grey.300', backgroundColor: 'common.white' }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={searchLabel}
                        value={localSearchTerm}
                        onChange={(e) => setLocalSearchTerm(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md>
                    <Autocomplete
                        size="small"
                        options={districts}
                        getOptionLabel={(option) => option.name}
                        value={districts.find((d) => d.id === district_id) || null}
                        onChange={(_, newValue) => {
                            dispatch(setDistrictId(newValue?.id || null));
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Select District" placeholder="Search District" />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md>
                    <Autocomplete
                        size="small"
                        options={talukas}
                        getOptionLabel={(option) => option.name}
                        value={talukas.find((t) => t.id === taluka_id) || null}
                        onChange={(_, newValue) => {
                            dispatch(setTalukaId(newValue?.id || null));
                        }}
                        disabled={!district_id}
                        renderInput={(params) => (
                            <TextField {...params} label="Select Taluka" placeholder="Search Taluka" />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md>
                    <Autocomplete
                        size="small"
                        options={villages}
                        getOptionLabel={(option) => option.name}
                        value={villages.find((v) => v.id === village_id) || null}
                        onChange={(_, newValue) => {
                            dispatch(setVillageId(newValue?.id || null));
                        }}
                        disabled={!taluka_id}
                        renderInput={(params) => (
                            <TextField {...params} label="Select Village" placeholder="Search Village" />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={1} md="auto">
                    <Tooltip title="Reset Filters">
                        <IconButton onClick={handleResetFilters}>
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SearchFilterBar;
