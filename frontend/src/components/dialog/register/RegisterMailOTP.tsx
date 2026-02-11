import { Box, Button, TextField, Typography } from '@mui/material';
import GlobalDialogContent from '../GlobalDialogContent';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { closeDialog } from '../../../redux/reducer/dialogSlice';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
import { useEffect, useRef, useState } from 'react';
import { setMailVerified } from '../../../redux/reducer/regMailVerifySlice';
import { VerifyMailOTP } from '../../../utils/services/ngo.registration.service';

export default function RegisterMailOTP() {

    const dispatch = useDispatch();
    const { payload } = useSelector((state: RootState) => state.dialog);
    const email = payload;
    const [otp, setOtp] = useState<string>('');
    const paddedOtp = otp.padEnd(6, '');
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [timer, setTimer] = useState<number>(30);
    const [resendCounter, setResendCounter] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        setTimer(30);
        interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    
        return () => {
            clearInterval(interval);
        };
    }, [email, resendCounter]);
        
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp =
            otp.substring(0, index) + value + otp.substring(index + 1);
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace') {
            const newOtp =
                paddedOtp.substring(0, index) +
                '' +
                paddedOtp.substring(index + 1);

            setOtp(newOtp);

            if (index > 0) {
                otpRefs.current[index - 1]?.focus();
            }
        } else if (e.key === 'Enter' && index == 5) {
            handleOtpSubmit();
        }
    };

    const handleOtpSubmit = async () => {
        const submitPayload = {
           email: email.trim(),
            otp: otp
        };
        const { code, message } = await VerifyMailOTP(submitPayload);
        if (code === 200 ) {
            dispatch(closeDialog());
            dispatch(setMailVerified({isMailVerified: true,optnumber: otp , email}));
            dispatch(showSnackbar({ type: 'success', message: message }));
        } else {
            dispatch(setMailVerified({isMailVerified: false,optnumber: otp}));
            dispatch(showSnackbar({ type: 'error', message: message || 'Something Went Wrong ,Please try again' }));
        }
    }
    const handleResend = () => {
        let interval: NodeJS.Timeout;
        setOtp('')
        setTimer(30);
        interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);    
        setResendCounter((prev) => prev + 1);
        dispatch(setMailVerified({ resend: true }));
        return () => {
            clearInterval(interval);
        };
    };

    return (
        <GlobalDialogContent
            dialogBody={
                <>
                    <Typography variant='h6' sx={{ textAlign: 'center', mb: 2 }}>Otp Sent On <b>{email}</b></Typography>
                    <Box sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                        {[...Array(6)].map((_, index) => (
                            <TextField
                                key={index}
                                variant="outlined"
                                size="small"
                                autoComplete="off"
                                inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                                value={otp[index] || ''}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e: any) => handleOtpKeyDown(index, e)}
                                inputRef={(el) => (otpRefs.current[index] = el)}
                                autoFocus={index === 0}
                                sx={{
                                    borderRadius: 2,
                                    pl: 1,
                                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                    width: '50px',
                                }}
                            />
                        ))}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 ,}}>
                    {timer > 1 ?
                    <Typography color="textSecondary">
                        Resend OTP in {timer} second{timer !== 1 ? 's' : ''}
                    </Typography>
                    :
                    <Button onClick={handleResend} disabled={timer > 0 }>
                        Resend OTP
                    </Button>
                    }
                </Box>

                </>
            }
            dialogFooter={
                <Button
                    variant="contained"
                    type='submit'
                    onClick={handleOtpSubmit}
                    disabled={otp.length !== 6}
                >
                    Submit OTP
                </Button>
            }
        />
    );
}