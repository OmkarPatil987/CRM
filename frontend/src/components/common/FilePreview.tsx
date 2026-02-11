import React from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface FilePreviewDrawerProps {
	open: boolean;
	onClose: () => void;
	fileUrl?: string;
	title?: string;
}

const FilePreviewDrawer: React.FC<FilePreviewDrawerProps> = ({ open, onClose, fileUrl, title, }) => {
	let content: React.ReactNode;

	if (!fileUrl) {
		content = <Typography>No file selected</Typography>;
	} else if (fileUrl.endsWith(".pdf")) {
		content = <iframe src={fileUrl} width="100%" height="500px" />;
	} else {
		content = <img src={fileUrl} alt="Preview" width="100%" />;
	}

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			sx={{ "& .MuiDrawer-paper": { width: "50%", padding: 0, zIndex: 999 } }}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					bgcolor: "primary.main",
					color: "white",
					p: 1,
				}}
			>
				<Typography variant="h6">{title || "File Preview"}</Typography>
				<IconButton onClick={onClose} sx={{ color: "white" }}>
					<Close />
				</IconButton>
			</Box>
			{content}
		</Drawer>
	);
};

export default FilePreviewDrawer;
