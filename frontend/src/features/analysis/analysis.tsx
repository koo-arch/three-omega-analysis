import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useAuthAxios } from '../../hooks/auth/useAuthAxios';
import { useAppDispatch } from '../../hooks/redux/reduxHooks';
import { setSnackbar } from '../../redux/slices/snackbarSlice';
import Configuration from '../setting/configuration';
import CreateGraph from '../graph/createGraph';
import urls from '../../api/urls';
import { format } from 'date-fns';
import { Button } from '@mui/material';


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
    const { handleSubmit, clearErrors } = method;
    const dispatch = useAppDispatch();

    const postAnalysisData = async (data: FormValues) => {
        return await authAxios.post(urls.Analysis, data, { responseType: 'blob' });
    }

    const formatedDate = format(new Date(), "yyyyMMdd");
    const fileName = `analysis_${formatedDate}.csv`;

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        clearErrors();
        postAnalysisData(data)
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                dispatch(setSnackbar({
                    open: true,
                    message: "解析データを送信しました",
                    severity: "success"
                }))
            
            })
            .catch(err => {
                dispatch(setSnackbar({
                    open: true,
                    message: "解析データの送信に失敗しました",
                    severity: "error"
                }))
            })
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormProvider {...method}>
                    <Configuration />
                    <CreateGraph />
                </FormProvider>
                <Button variant='outlined' type="submit">送信</Button>
            </form>
        </div>
    )
}

export default Analysis;