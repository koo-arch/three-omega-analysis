import React, { forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useAppDispatch } from '@/hooks/redux/reduxHooks';
import { setSnackbar } from '@/redux/slices/snackbarSlice';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface CustomSnackbarProps {
    open: boolean;
    severity: 'success' | 'info' | 'warning' | 'error';
    message: string;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = (props) => {
    const { open, severity, message } = props;
    const dispatch = useAppDispatch();
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setSnackbar({ open: false, severity: 'success', message: '' }));
    }

    return (
        <Snackbar 
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message.split('\n').map((line: string, index: number) => (
                    <span key={index}>
                        {line}
                        <br />
                    </span>
                ))}
            </Alert>
        </Snackbar>
    );
}

export default CustomSnackbar;