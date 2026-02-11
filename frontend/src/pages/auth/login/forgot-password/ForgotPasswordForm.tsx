import { useState, memo } from "react";
import { useDispatch } from "react-redux";
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Divider,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { ForgotPasswordService } from "../../../../utils/services/auth.service";
import { showSnackbar } from "../../../../redux/reducer/snackbarSlice";

interface ForgotProps {
    openOtp: boolean;
    closeOtop: () => void;
}

const ForgotPasswordForm: React.FC<ForgotProps> = memo(({ openOtp, closeOtop }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateEmail = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setError("");
        if (!validateEmail()) return;

        setLoading(true);
        const { code, message } = await ForgotPasswordService({ email });
        setLoading(false);
        if (code === 200) {
            dispatch(showSnackbar({ type: "success", message }));
            closeOtop();
            setEmail("");
        } else {
            setError(message || "Failed to send reset link.");
        }
    };

    return (
        <Dialog open={openOtp} maxWidth="xs" fullWidth>
            <DialogTitle>
                <Typography fontWeight="bold">Forgot Password</Typography>
                <IconButton onClick={closeOtop} sx={{ position: "absolute", right: 10, top: 10 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        size="small"
                        margin="normal"
                        required
                        fullWidth
                        placeholder="Enter your email"
                        label="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="end">
                                    <EmailOutlinedIcon fontSize="small" color="primary" />
                                    <Divider orientation="vertical" sx={{ height: 15, mx: 1 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />

                    {error && (
                        <Typography variant="body2" color="error" textAlign="center" sx={{ mb: 1 }}>
                            {error}
                        </Typography>
                    )}

                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button
                            type="submit"
                            onClick={() => handleSubmit()}
                            variant="contained"
                            color="primary"
                            sx={{
                                fontWeight: 600,
                                borderRadius: 2,
                                boxShadow: "0px 4px 12px rgba(33, 150, 243, 0.3)",
                                minWidth: 160,
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    Sending...
                                    <CircularProgress size={20} sx={{ color: "primary.light", ml: 1 }} />
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
});

export default ForgotPasswordForm;
