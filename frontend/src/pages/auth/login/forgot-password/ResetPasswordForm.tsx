import { Box, TextField, Button, Typography, InputAdornment, Divider, IconButton, Container, Avatar, CircularProgress, } from "@mui/material";
import { LockOutlined as LockOutlinedIcon, VisibilityOffOutlined as VisibilityOffOutlinedIcon, VisibilityOutlined as VisibilityOutlinedIcon, } from "@mui/icons-material";
import { useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import TagIcon from '@mui/icons-material/Tag';
import { NAVIGATE_AUTH } from "../../../../constant";
import { ResetPasswordService } from "../../../../utils/services/auth.service";
import { showSnackbar } from "../../../../redux/reducer/snackbarSlice";

const validationSchema = Yup.object({
	newPassword: Yup.string().required("New password is required").matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters long, contain a number, and a special character"),
	confirmPassword: Yup.string().required("Confirm password is required").oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

const ResetPasswordForm = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token") || "";
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleBackToLogin = useCallback(() => {
		navigate(NAVIGATE_AUTH.LOGOUT_PAGE);
	}, [navigate]);

	const inputProps = useMemo( () => ({
			newPassword: {
				startAdornment: (
					<InputAdornment position="end">
						<LockOutlinedIcon fontSize="small" sx={{ mr: 1 }} color="primary" />
						<Divider orientation="vertical" sx={{ height: 15 }} />
					</InputAdornment>
				),
				endAdornment: (
					<InputAdornment position="end">
						<IconButton
							onClick={() => setShowPassword(!showPassword)}
							aria-label="Toggle password visibility"
						>
							{showPassword ? (<VisibilityOutlinedIcon fontSize="small" color="primary" />) : (<VisibilityOffOutlinedIcon fontSize="small" color="primary" />)}
						</IconButton>
					</InputAdornment>
				),
			},
			confirmPassword: {
				startAdornment: (
					<InputAdornment position="end">
						<LockOutlinedIcon fontSize="small" sx={{ mr: 1 }} color="primary" />
						<Divider orientation="vertical" sx={{ height: 15 }} />
					</InputAdornment>
				),
				endAdornment: (
					<InputAdornment position="end">
						<IconButton
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							aria-label="Toggle confirm password visibility"
						>
							{showConfirmPassword ? (<VisibilityOutlinedIcon fontSize="small" color="primary" />) : (<VisibilityOffOutlinedIcon fontSize="small" color="primary" />)}
						</IconButton>
					</InputAdornment>
				),
			},
		}),
		[showPassword, showConfirmPassword]
	);

	return (
		<Box
			sx={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<Container
				component="main"
				maxWidth="xs"
				sx={{
					minHeight: "90vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Box
					sx={{
						width: "100%",
						p: 3,
						borderRadius: 3,
						bgcolor: "#fff",
						border:'1px solid rgba(0,0,0,0.1)',
						boxShadow: "0px 8px 16px rgba(0,0,0,0.1)",
						my: 2,
					}}
				>
					<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
						{!token ?
							<>
								<Avatar sx={{ bgcolor: "primary.main", width: 54, height: 54, mb: 2 }}>
									<TagIcon fontSize="large" />
								</Avatar>
								<Typography variant="h5" fontWeight={700}>
									Invalid Token !
								</Typography>
							</>
							:
							<>
								<Avatar sx={{ bgcolor: "primary.main", width: 64, height: 64, mb: 2 }}>
									<LockOutlinedIcon fontSize="large" />
								</Avatar>
								<Typography variant="h5" fontWeight={700}>
									Reset Password
								</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
									Enter new password
								</Typography>
							</>
						}
					</Box>

					<Box sx={{ width: "100%", maxWidth: 400, mx: "auto", p: 2 }}>
						{success ? (
							<Box sx={{ textAlign: "center" }}>
								<Typography variant="h6" sx={{ mb: 2, color:'success.main' }}>
									Password Reset Successfully!
								</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
									Your password has been updated. You can now log in with your new password.
								</Typography>
								<Button
									variant="text"
									color="info"
									onClick={handleBackToLogin}
									sx={{ fontStyle: "italic", textTransform: "none" }}
								>
									Back to Login
								</Button>
							</Box>
						) : (
							<Formik
								initialValues={{ newPassword: "", confirmPassword: "" }}
								validationSchema={validationSchema}
								onSubmit={async (values, { setSubmitting, setStatus }) => {
									if (!token) {
										setStatus("Invalid or missing token.");
										setSubmitting(false);
										return;
									}

									const payload = { token, password: values.newPassword };
									const { code, message } = await ResetPasswordService(payload);

									if (code === 200) {
										dispatch(showSnackbar({ type: "success", message }));
										setSuccess(true);
									} else {
										setStatus(message || "Failed to reset password.");
									}
								}}
							>
								{({ errors, touched, isSubmitting, status }) => (
									token ? (
										<Form noValidate>
											<Field
												name="newPassword"
												as={TextField}
												variant="outlined"
												size="small"
												margin="normal"
												fullWidth
												label="New Password"
												placeholder="Enter new password"
												type={showPassword ? "text" : "password"}
												InputProps={inputProps.newPassword}
												error={touched.newPassword && !!errors.newPassword}
												helperText={touched.newPassword && errors.newPassword}
												sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
											/>

											<Field
												name="confirmPassword"
												as={TextField}
												variant="outlined"
												size="small"
												margin="normal"
												fullWidth
												label="Confirm Password"
												placeholder="Confirm new password"
												type={showConfirmPassword ? "text" : "password"}
												InputProps={inputProps.confirmPassword}
												InputLabelProps={{ shrink: true }}
												error={touched.confirmPassword && !!errors.confirmPassword}
												helperText={touched.confirmPassword && errors.confirmPassword}
												sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
											/>

											{status && (
												<Typography variant="body2" color="error" textAlign="center" sx={{ mb: 1 }}>
													{status}
												</Typography>
											)}

											<Button
												type="submit"
												fullWidth
												variant="contained"
												color="primary"
												disabled={isSubmitting}
												sx={{
													mt: 2,
													py: 1.2,
													fontWeight: 600,
													borderRadius: 2,
													boxShadow: "0px 4px 12px rgba(33, 150, 243, 0.3)",
												}}
											>
												{isSubmitting ? (
													<>
														Resetting...
														<CircularProgress size={20} sx={{ color: "primary.light", ml: 1 }} />
													</>
												) : (
													"Reset Password"
												)}
											</Button>
										</Form>
									) : (
										<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
											<Typography fontWeight={700}>
												Please Recheck URL
											</Typography>
										</Box>
									)
								)}
							</Formik>
						)}
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default ResetPasswordForm;