import React from 'react';
import { useAuthAxios } from '../../hooks/auth/useAuthAxios';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/reduxHooks';
import { setSnackbar } from '../../redux/slices/snackbarSlice';
import { setUploadedData } from '../../redux/slices/uploadedDataSlice';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../analysis/analysis';
import urls from '../../api/urls';
import {
    Box,
    List,
    ListItemText,
    ListItemButton,
    IconButton,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StartEndIcon from '@mui/icons-material/LinearScale';

interface GraphListProps {
    activeIndex: number;
    onListItemClick: (index: number) => void;
}

const GraphList: React.FC<GraphListProps> = ({ activeIndex, onListItemClick }) => {
    const dispatch = useAppDispatch();
    const authAxios = useAuthAxios();
    const { unregister } = useFormContext<FormValues>();
    const uploadedData = useAppSelector(state => state.uploadedData.data?.data);
    const selectedPoints = useAppSelector(state => state.selectedPoints);

    const handleDelete = async (fileName: string) => {
        try {
            await authAxios.post(urls.DeleteGraphData, { file_name: fileName });
            dispatch(setSnackbar({
                open: true,
                severity: 'success',
                message: '削除に成功しました。'
            }));
            // fileNameキーを除外して新しいオブジェクトを作成
            const { [fileName]: _, ...newUploadedData } = uploadedData ? uploadedData : {};
            dispatch(setUploadedData({ data: newUploadedData }));
            
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
        <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
            <List>
                {uploadedData &&
                    Object.keys(uploadedData).map((fileName, index) => {
                        const points = selectedPoints[fileName];
                        const displayPoints = points ? `${points.start}, ${points.end}` : '未設定';
                        return (
                            <ListItemButton 
                                key={fileName}
                                onClick={() => onListItemClick(index)}
                                selected={activeIndex === index}
                            >
                                <ListItemText primary={fileName} secondary={
                                    <Typography component="span" variant="body2" color="textSecondary">
                                        <StartEndIcon fontSize="small" /> {displayPoints}
                                    </Typography>
                                } />
                                <IconButton
                                    color='error'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(fileName);
                                    }}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemButton>
                        )
                    })
                }
            </List>
        </Box>
    )
}

export default GraphList;