import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useAuthAxios } from '../../hooks/auth/useAuthAxios';
import { useAppDispatch } from '../../hooks/redux/reduxHooks';
import { setSnackbar } from '../../redux/slices/snackbarSlice';
import { clearUploadError } from '../../redux/slices/uploadErrorSlice';
import ValueSetting from './components/valueSetting';
import Configuration from './components/configuration';
import UploadText from './uploadText';
import GraphField from './components/graphField';
import UploadError from './uploadErrors';
import { AnalysisForm } from '../../types/features/analysis';
import urls from '../../api/urls';
import { downloadCSV, parseBlobToJson } from '../../utils/blob';
import { useErrorMessage } from '../../hooks/utils/errorHandler';
import { Box, Grid, Card, CardContent } from '@mui/material';
import AnalysisButton from './analysisButton';


const Analysis : React.FC = () => {
    const authAxios = useAuthAxios();
    const method = useForm<AnalysisForm>();
    const { handleSubmit, setError } = method;
    const dispatch = useAppDispatch();
    const errorMessage = useErrorMessage<AnalysisForm>();

    const postAnalysisData = async (data: AnalysisForm) => {
        return await authAxios.post(urls.Analysis, data, { responseType: 'blob' });
    }

    const onSubmit: SubmitHandler<AnalysisForm> = (data) => {
        postAnalysisData(data)
            .then(res => {
                downloadCSV('analysis', res.data)
                dispatch(setSnackbar({
                    open: true,
                    message: "解析データを送信しました",
                    severity: "success"
                }))
                dispatch(clearUploadError());
            
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
                <UploadError />
                <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                        <UploadText />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card variant='outlined' sx={{ mb: 2, height: 240 }}>
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
            <Grid container justifyContent={'flex-end'}>
                <Grid item>
                    <AnalysisButton />
                </Grid>
            </Grid>
        </div>
    )
}

export default Analysis;