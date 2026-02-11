import { Chip } from "@mui/material";
import { getCategoryIcon } from "../utils/productUtils";

interface CategoryChipProps {
    category: string;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ category }) => (
    <Chip
        icon={getCategoryIcon(category)}
        label={category}
        size="small"
        variant="outlined"
        sx={{
            fontWeight: 600,
            borderColor: "currentColor",
            backgroundColor: "rgba(59, 89, 152, 0.08)",
        }}
    />
);

export default CategoryChip;
