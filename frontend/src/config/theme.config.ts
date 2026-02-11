import { ThemeOptions } from '@mui/material'

const themeConfig = (): ThemeOptions => {
    const mode = 'light'

    const config = {
        typography: {
            htmlFontSize: 16,
            fontFamily: "'DM Sans', 'Space Grotesk', sans-serif",
            fontSize: 14,
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 500,
            fontWeightBold: 700,
            h1: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2, fontFamily: "'Space Grotesk', 'DM Sans', sans-serif" },
            h2: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.2, fontFamily: "'Space Grotesk', 'DM Sans', sans-serif" },
            h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3, fontFamily: "'Space Grotesk', 'DM Sans', sans-serif" },
            h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4, fontFamily: "'Space Grotesk', 'DM Sans', sans-serif" },
            h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4, fontFamily: "'Space Grotesk', 'DM Sans', sans-serif" },
            h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.4, fontFamily: "'Space Grotesk', 'DM Sans', sans-serif" },
            button: { fontSize: '0.875rem', fontWeight: 600, textTransform: 'none' },
        },
        // Reduced Radius for a Sharper UI
        shape: { borderRadius: 4 },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '4px', // Crisp edges
                        padding: '6px 16px',
                        boxShadow: 'none', // Flat design is often better for enterprise
                        '&:hover': {
                            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '4px',
                            backgroundColor: '#ffffff',
                            '& fieldset': { borderColor: '#d1d5db' },
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        border: '1px solid #e5e7eb', // Subtle border instead of heavy shadow
                        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
                    },
                },
            },
        }
    }

    const palette = {
        palette: {
            mode: 'light',
            primary: {
                main: '#1337ec', // SalesCRM blue
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#6366f1',
                contrastText: '#ffffff',
            },
            background: {
                paper: '#ffffff',
                default: '#f6f6f8',
            },
            text: {
                primary: '#0f172a',
                secondary: '#64748b',
            },
            divider: '#e5e7eb',
        },
    }

    return { ...palette, ...config } as ThemeOptions
}

export default themeConfig
