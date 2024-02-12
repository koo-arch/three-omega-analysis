import React from 'react';
import { useAuthAxios } from '../../hooks/auth/useAuthAxios';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/reduxHooks';
import { setSnackbar } from '../../redux/slices/snackbarSlice';
import { setUploadedData } from '../../redux/slices/uploadedDataSlice';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../analysis/analysis';
import urls from '../../api/urls';
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


const GraphList: React.FC = () => {
    const dispatch = useAppDispatch();
    const authAxios = useAuthAxios();
    const { unregister } = useFormContext<FormValues>();
    const uploadedData = useAppSelector(state => state.uploadedData.data);

    const handleDelete = async (fileName: string) => {
        try {
            await authAxios.delete(urls.DeleteGraph, {
                data: { file_name: fileName}
            });
            dispatch(setSnackbar({
                open: true,
                severity: 'success',
                message: '削除に成功しました。'
            }));
            // fileNameキーを除外して新しいオブジェクトを作成
            const { [fileName]: _, ...newUploadedData } = uploadedData ? uploadedData : {};
            dispatch(setUploadedData(newUploadedData));
            
            unregister(`graphs.${fileName}`);
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
        <div>
            <List>
                {uploadedData &&
                    Object.keys(uploadedData).map((fileName) => {
                        return (
                            <ListItem key={fileName}>
                                <ListItemText primary={fileName} />
                                <IconButton color='error' onClick={() => handleDelete(fileName)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        )
                    })
                }
            </List>
        </div>
    )
}

export default GraphList;