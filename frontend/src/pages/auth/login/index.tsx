import { useState } from "react";
import { useDispatch } from "react-redux";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Divider,
    IconButton,
    Avatar,
    useTheme,
    FormLabel,
    Fade,
} from "@mui/material";
import {
    LockPersonOutlined,
    PasswordOutlined,
    PersonOutlineOutlined,
    RemoveRedEyeOutlined,
    VisibilityOffOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { setAuthUser } from "../../../redux/reducer/authUserSlice";
import { loginService } from "../../../utils/services/auth.service";
import { encryptText } from "../../../utils/utils";

const LoginPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Professional Green Palette
    const agriColors = {
        primary: "#064e3b", // Deep Forest Green
        accent: "#10b981",  // Emerald Green
        bgGradient: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #059669 100%)",
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setErrorMessage("");
        setLoading(true);

        if (!username || !password) {
            setErrorMessage("Please enter email and password.");
            setLoading(false);
            return;
        }

        const payload = { username, password };
        const { code, data, message } = await loginService(payload);

        if (code === 200 && data) {
            const rec = {
                userDetails: data.user,
                token: data.token,
                session_expires: null,
            };
            dispatch(setAuthUser(rec));
            const encrypted = JSON.stringify(rec);
            localStorage.setItem("user_auth_session", encryptText(encrypted));
            dispatch(
                showSnackbar({
                    type: "success",
                    message: `✅ Login Successful \n Welcome, ${rec?.userDetails?.name}`,
                })
            );
            navigate("/admin/products");
        } else {
            setErrorMessage("Invalid username or password.");
            dispatch(
                showSnackbar({
                    type: "error",
                    message: message || "Something went wrong, please try again",
                })
            );
        }
        setLoading(false);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: agriColors.bgGradient,
                px: 2,
            }}
        >
            <Fade in={true} timeout={800}>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.98)",
                            p: { xs: 3, sm: 5 },
                            borderRadius: 4,
                            boxShadow: "0px 20px 60px rgba(0,0,0,0.3)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                        }}
                    >
                        {/* Branding */}
                        <Avatar
                            sx={{
                                width: 70,
                                height: 70,
                                backgroundColor: agriColors.primary,
                                mb: 2,
                                boxShadow: "0px 8px 16px rgba(6, 78, 59, 0.2)",
                            }}
                        >
                            <LockPersonOutlined sx={{ fontSize: 35, color: "#fff" }} />
                        </Avatar>

                        <Typography
                            component="h1"
                            variant="h4"
                            fontWeight={800}
                            sx={{ color: agriColors.primary, letterSpacing: -0.5 }}
                        >
                            apna<span style={{ color: agriColors.accent }}>QR</span>
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 4, textAlign: "center", fontWeight: 500 }}
                        >
                            Government-Compliant Agri-Platform
                        </Typography>

                        {/* Login Form */}
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Username / Email"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setErrorMessage("");
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineOutlined sx={{ color: agriColors.primary }} />
                                            <Divider orientation="vertical" sx={{ height: 20, ml: 1 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                        backgroundColor: "#f9fafb",
                                        "&:hover fieldset": { borderColor: agriColors.accent },
                                    },
                                }}
                            />

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrorMessage("");
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PasswordOutlined sx={{ color: agriColors.primary }} />
                                            <Divider orientation="vertical" sx={{ height: 20, ml: 1 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOffOutlined /> : <RemoveRedEyeOutlined />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                        backgroundColor: "#f9fafb",
                                        "&:hover fieldset": { borderColor: agriColors.accent },
                                    },
                                }}
                            />

                            {errorMessage && (
                                <Box sx={{ mt: 1, textAlign: "center" }}>
                                    <Typography variant="caption" color="error" fontWeight={600}>
                                        {errorMessage}
                                    </Typography>
                                </Box>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    mt: 4,
                                    py: 1.8,
                                    fontWeight: 700,
                                    borderRadius: 3,
                                    fontSize: "1rem",
                                    textTransform: "none",
                                    backgroundColor: agriColors.primary,
                                    boxShadow: `0px 8px 20px rgba(6, 78, 59, 0.3)`,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        backgroundColor: "#065f46",
                                        transform: "translateY(-2px)",
                                        boxShadow: `0px 12px 24px rgba(6, 78, 59, 0.4)`,
                                    },
                                }}
                            >
                                {loading ? "Verifying Credentials..." : "Secure Login"}
                            </Button>

                            <Box sx={{ mt: 3, textAlign: "center" }}>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => navigate("/forgot-password")}
                                    sx={{
                                        textTransform: "none",
                                        color: agriColors.primary,
                                        fontWeight: 600,
                                        "&:hover": { backgroundColor: "transparent", color: agriColors.accent }
                                    }}
                                >
                                    Forgot your password?
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    <Typography
                        variant="body2"
                        color="rgba(255,255,255,0.7)"
                        align="center"
                        sx={{ mt: 4, fontWeight: 500 }}
                    >
                        © {new Date().getFullYear()} apnaQR Agri-Systems. <br /> Secure Portal
                    </Typography>
                </Container>
            </Fade>
        </Box>
    );
};

export default LoginPage;
