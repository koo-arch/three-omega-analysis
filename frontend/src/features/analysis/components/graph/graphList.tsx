import React from 'react';
import { useAuthAxios } from '../../../../hooks/auth/useAuthAxios';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux/reduxHooks';
import { setSnackbar } from '../../../../redux/slices/snackbarSlice';
import { updateFileData } from '../../../../redux/slices/uploadedDataSlice';
import { useFormContext } from 'react-hook-form';
import { AnalysisForm } from '../../../../types/features/analysis';
import urls from '../../../../api/urls';
import {
    Box,
    List,
    ListItemText,
    ListItemButton,
    IconButton,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TimeLineIcon from '@mui/icons-material/Timeline';

interface GraphListProps {
    activeIndex: number;
    onListItemClick: (index: number) => void;
}

const GraphList: React.FC<GraphListProps> = ({ activeIndex, onListItemClick }) => {
    const dispatch = useAppDispatch();
    const authAxios = useAuthAxios();
    const { unregister } = useFormContext<AnalysisForm>();
    const fileDataRow = useAppSelector(state => state.uploadedData.data);
    const uploadedData = fileDataRow?.data;
    const id = fileDataRow?.id;
    const selectedPoints = useAppSelector(state => state.selectedPoints);

    const handleDelete = async (fileName: string) => {
        try {
            await authAxios.patch(`${urls.ClearGraphData}${id}/`, { file_name: fileName });
            dispatch(setSnackbar({
                open: true,
                severity: 'success',
                message: '削除に成功しました。'
            }));
            // fileNameキーを除外して新しいオブジェクトを作成
            const { [fileName]: _, ...newUploadedData } = uploadedData ? uploadedData : {};
            dispatch(updateFileData(newUploadedData));
            
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
                        const startPoint = points?.start ? points.start : '--';
                        const endPoint = points?.end ? points.end : '--';
                        return (
                            <ListItemButton 
                                key={fileName}
                                onClick={() => onListItemClick(index)}
                                selected={activeIndex === index}
                            >
                                <ListItemText
                                    primary={fileName}
                                    secondary={
                                        <Typography component="span" variant="body2" color="textSecondary">
                                            <TimeLineIcon fontSize="small" style={{ verticalAlign: "middle" }} />
                                            {' '}{startPoint} ~ {endPoint}
                                        </Typography>
                                    }
                                />

                                <IconButton
                                    aria-label={`delete ${fileName}`}
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