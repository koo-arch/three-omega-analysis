import React from 'react';
import { useAuthAxios } from '../../../../hooks/auth/useAuthAxios';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux/reduxHooks';
import { setSnackbar } from '../../../../redux/slices/snackbarSlice';
import { updateFileData } from '../../../../redux/slices/uploadedDataSlice';
import { useFormContext } from 'react-hook-form';
import { AnalysisForm } from '../../../../types/features/analysis';
import urls from '../../../../api/urls';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const GraphClearButton: React.FC = () => {
    const authAxios = useAuthAxios();
    const dispatch = useAppDispatch();
    const { unregister } = useFormContext<AnalysisForm>();
    const fileDataRow = useAppSelector(state => state.uploadedData.data);
    const id = fileDataRow?.id;

    const handleClear = async () => {
        try {
            await authAxios.patch(`${urls.ClearAllGraph}${id}/`);
            dispatch(setSnackbar({
                open: true,
                severity: 'success',
                message: '削除に成功しました。'
            }));
            dispatch(updateFileData({}));
            unregister('graphs');
        }
        catch (error) {
            console.log(error);
            dispatch(setSnackbar({
                open: true,
                severity: 'error',
                message: '削除に失敗しました。'
            }));
        }
    }

    return (
        <Button
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClear}
        >
            全削除
        </Button>
    );
}

export default GraphClearButton;