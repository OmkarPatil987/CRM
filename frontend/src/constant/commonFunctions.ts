
export function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export const getRandomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;  

interface OrganizationTypeOption {
    value: string;
    label: string;
}
export const organizationTypes: OrganizationTypeOption[] = [
    { value: 'admin', label: 'Admin' },
];

export const phoneRegex = /^(?:\+91[-\s]?|0)?[6-9]\d{9}$/;
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const getButtonStyles = () => ({
    background: "#013E5E",
    color: "#fff",
    borderRadius: "8px",
    transition: "background 0.3s ease-in-out",
    "&:hover": {
        background: "#013E5E",
    },
    "&:disabled": {
        border: "1px solid #013E5E",
        backgroundColor: "#fff",
        color: "#013E5E",
        cursor: "not-allowed",
    },
});

export const roundedInputBoxStyle = (height: string) => ({
    backgroundColor: 'white',
    borderRadius: '50px',
    border: 'none',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
    '& .MuiOutlinedInput-root': {
        borderRadius: '50px',
        height: height,

        paddingRight: '10px',
        display: 'flex',
        alignItems: 'center',
    },
});
