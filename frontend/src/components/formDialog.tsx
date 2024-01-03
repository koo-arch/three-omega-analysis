import React from 'react';
import {
    useMediaQuery,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box
} from '@mui/material';

interface FormDialogProps {
    open: boolean;
    onClose: () => void;
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    title: string;
    children: React.ReactNode;
    buttonText: string;
}

const FormDialog: React.FC<FormDialogProps> = (props) => {
    const { open, onClose, color, title, children, buttonText } = props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div>
            <Dialog
                open={open}
                onClose={onClose}
                sx={{ minWidth: '300px' }}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Box sx={{ ...(isMobile ? { minWidth: 250 } : { minWidth: 400 }), }}>
                    </Box>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={onClose}>キャンセル</Button>
                    <Button variant='contained' type="submit" form="dialog-form" color={color}>{buttonText}</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default FormDialog;