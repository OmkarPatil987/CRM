import { Laptop, Chair, LocalOffer } from "@mui/icons-material";
import React from "react";

export const getCategoryIcon = (category: string): React.ReactElement => {
    const iconMap: { [key: string]: React.ReactElement } = {
        Electronics: <Laptop sx={{ fontSize: 16 }
} />,
Furniture: <Chair sx={ { fontSize: 16 } } />,
Clothing: <LocalOffer sx={ { fontSize: 16 } } />,
Books: <LocalOffer sx={ { fontSize: 16 } } />,
Toys: <LocalOffer sx={ { fontSize: 16 } } />,
    };
return iconMap[category] || <LocalOffer sx={ { fontSize: 16 } } />;
};

export const getCategoryColor = (
    category: string
): "default" | "primary" | "secondary" | "success" | "warning" | "error" => {
    const colorMap: {
        [key: string]: "default" | "primary" | "secondary" | "success" | "warning" | "error";
    } = {
        Electronics: "primary",
        Furniture: "warning",
        Clothing: "secondary",
        Books: "primary",
        Toys: "success",
    };
    return (colorMap[category] as "default" | "primary" | "secondary" | "success" | "warning" | "error") ||
        "default";
};

export const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString()}`;
};

export const getStockStatus = (stock: number): { label: string; severity: "error" | "warning" | "success" } => {
    if (stock === 0) {
        return { label: "Out of Stock", severity: "error" };
    } else if (stock < 50) {
        return { label: `Low (${stock})`, severity: "warning" };
    }
    return { label: `In Stock (${stock})`, severity: "success" };
};
