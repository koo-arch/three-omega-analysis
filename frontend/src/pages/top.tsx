import React from 'react';
import { useAppSelector } from '../hooks/redux/reduxHooks';
import CustomSnackbar from '../components/customSnackbar';
import Analysis from '../features/analysis/analysis';
import { Container, Typography } from '@mui/material';


const Top: React.FC = () => {
    const snackbar = useAppSelector(state => state.snackbar);

    return (
        <div>
            <Container maxWidth="md">
                <Typography component={"h1"} variant='h3'>
                    3ω解析
                </Typography>
                <Analysis />
            </Container>
            <CustomSnackbar {...snackbar} />
        </div>
    )
}

export default Top;