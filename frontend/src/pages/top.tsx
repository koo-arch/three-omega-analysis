import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux/reduxHooks';
import { setSnackbar } from '../redux/snackbarSlice';
import CustomSnackbar from '../components/customSnackbar';
import UploadText from '../features/analysis/uploadText';
import { Box, Container, Typography, Button } from '@mui/material';

const Top: React.FC = () => {
    const snackbar = useAppSelector(state => state.snackbar);

    return (
        <div>
            <Container maxWidth="md">
                <Typography component={"h1"} variant='h3'>
                    3ω解析
                </Typography>
                <UploadText />
            </Container>
            <CustomSnackbar {...snackbar} />
        </div>
    )
}

export default Top;