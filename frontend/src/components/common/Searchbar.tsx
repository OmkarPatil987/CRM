import React from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
    searchTerm: string;
    onSearch?: (searchTerm: string) => void;
    onSearchTermChange: (searchTerm: string) => void;
    searchName?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch, onSearchTermChange, searchName }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchTermChange(event.target.value);
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    return (
        <TextField
            variant="outlined"
            type='search'
            placeholder={searchName ?? 'Search...'}
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            }}
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleSearch}>
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            sx={{
                bgcolor: 'background.paper',
                borderRadius: '20px',
                minWidth: { xs: '100%', sm: 280 }, // responsive width
                '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                },
            }}
        />
    );
};

export default SearchBar;
