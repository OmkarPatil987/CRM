import {
    Box,
    Grid,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ToggleButtonGroup,
    ToggleButton,
    Tooltip,
    SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ViewListOutlined, ViewModuleOutlined } from "@mui/icons-material";
import { PRODUCT_CATEGORIES, SORT_OPTIONS } from "./constants/productConstants";

interface ProductFiltersProps {
    searchKeyword: string;
    selectedCategories: string[];
    statusFilter: string;
    sortBy: string;
    viewMode: "table" | "cards";
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string[]) => void;
    onStatusChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onViewModeChange: (value: "table" | "cards") => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
    searchKeyword,
    selectedCategories,
    statusFilter,
    sortBy,
    viewMode,
    onSearchChange,
    onCategoryChange,
    onStatusChange,
    onSortChange,
    onViewModeChange,
}) => {
    return (
        <Box
            sx={{
                borderBottomWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: "#ccc",
                px: 2,
                py: 2,
            }}
        >
            <Grid container spacing={2} alignItems="center">
                {/* Search */}
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        placeholder="Search by name..."
                        fullWidth
                        size="small"
                        value={searchKeyword}
                        onChange={(e) => onSearchChange(e.target.value.trim())}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                {/* Category Filter */}
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Category</InputLabel>
                        <Select
                            multiple
                            value={selectedCategories}
                            onChange={(e: SelectChangeEvent<string[]>) =>
                                onCategoryChange(e.target.value as string[])
                            }
                            label="Category"
                            renderValue={(selected) =>
                                selected.length === 0 ? "All" : `${selected.length} selected`
                            }
                        >
                            {PRODUCT_CATEGORIES.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Status Filter */}
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} label="Status">
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Sort By */}
                <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortBy} onChange={(e) => onSortChange(e.target.value)} label="Sort By">
                            {SORT_OPTIONS.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* View Toggle */}
                <Grid item xs={12} sm={6} md={2}>
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(_, newMode) => newMode && onViewModeChange(newMode)}
                        size="small"
                        fullWidth
                    >
                        <ToggleButton value="table">
                            <Tooltip title="Table View" placement="top">
                                <ViewListOutlined />
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="cards">
                            <Tooltip title="Card View" placement="top">
                                <ViewModuleOutlined />
                            </Tooltip>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductFilters;
