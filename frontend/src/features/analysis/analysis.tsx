import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useAuthAxios } from '../../hooks/auth/useAuthAxios';
import { useAppDispatch } from '../../hooks/redux/reduxHooks';
import { setSnackbar } from '../../redux/slices/snackbarSlice';
import ValueSetting from '../setting/valueSetting';
import Configuration from '../setting/configuration';
import UploadText from '../graph/uploadText';
import GraphField from '../graph/graphField';
import urls from '../../api/urls';
import { downloadCSV, parseBlobToJson } from '../../utils/blob';
import { useErrorMessage } from '../../hooks/utils/errorHandler';
import { Box, Button, Grid, Card, CardContent } from '@mui/material';


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


const Analysis : React.FC = () => {
    const authAxios = useAuthAxios();
    const method = useForm<FormValues>();
    const { handleSubmit, setError } = method;
    const dispatch = useAppDispatch();
    const errorMessage = useErrorMessage<FormValues>();

    const postAnalysisData = async (data: FormValues) => {
        return await authAxios.post(urls.Analysis, data, { responseType: 'blob' });
    }

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        postAnalysisData(data)
            .then(res => {
                downloadCSV('analysis', res.data)
                dispatch(setSnackbar({
                    open: true,
                    message: "解析データを送信しました",
                    severity: "success"
                }))
            
            })
            .catch(err => {
                if (err.response?.data) {
                    parseBlobToJson(err.response.data)
                        .then((errorData: any) => {
                            console.log(errorData)
                            const message = "解析データの送信に失敗しました"
                            errorMessage(errorData, setError, message)
                        })
                        .catch((error: Error) => {
                            dispatch(setSnackbar({
                                open: true,
                                message: error.message,
                                severity: "error"
                            }));
                        });
                }
            })
    }

    return (
        <div>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                        <UploadText />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card variant='outlined' sx={{ mb: 2 }}>
                            <CardContent>
                                <Configuration />
                                <form id="analysis-form" onSubmit={handleSubmit(onSubmit)}>
                                    <FormProvider {...method}>
                                        <ValueSetting />
                                    </FormProvider>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <FormProvider {...method}>
                <GraphField />
            </FormProvider>
            <Button variant='outlined' form="analysis-form" type="submit">送信</Button>
        </div>
    )
}

export default Analysis;