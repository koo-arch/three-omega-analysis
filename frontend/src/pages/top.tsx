import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { Form, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux/reduxHooks';
import { setSnackbar } from '../redux/snackbarSlice';
import CustomSnackbar from '../components/customSnackbar';
import Configuration from '../features/analysis/configuration';
import CreateGraph from '../features/graph/createGraph';
import { Box, Container, Typography, Button } from '@mui/material';

export interface SelectedPoints {
    start: number | undefined;
    end: number | undefined;
}

interface GraphValues {
    [graphName: string]: SelectedPoints;
}

 export interface FormValues {
    dRdT: number | undefined;
    length: number | undefined;
    graphs: GraphValues;
}

const Top: React.FC = () => {
    const snackbar = useAppSelector(state => state.snackbar);
    const method = useForm<FormValues>();
    const { handleSubmit } = method;

    return (
        <div>
            <Container maxWidth="md">
                <Typography component={"h1"} variant='h3'>
                    3ω解析
                </Typography>
                <form onSubmit={handleSubmit((data) => console.log(data))}>
                    <FormProvider {...method}>
                        <Configuration />
                        <CreateGraph />
                    </FormProvider>
                    <Button variant='outlined' type="submit">送信</Button>
                </form>
            </Container>
            <CustomSnackbar {...snackbar} />
        </div>
    )
}

export default Top;