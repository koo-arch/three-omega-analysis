import React, { useState, useCallback } from 'react';
import { useAuthAxios } from '../../hooks/auth/useAuthAxios';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/reduxHooks';
import { setSnackbar } from '../../redux/slices/snackbarSlice';
import { setUploadedData } from '../../redux/slices/uploadedDataSlice';
import { setPostFlag } from '../../redux/slices/postFlagSlice';
import urls from '../../api/urls';
import { useDropzone, DropzoneRootProps } from 'react-dropzone';
import {
    Box,
    Container,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const UploadText: React.FC = () => {
    const dispatch = useAppDispatch();
    const authAxios = useAuthAxios();
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles([...files, ...acceptedFiles]);
    }, [files]);

    const handleDelete = (fileToDelete: File) => {
        setFiles(files.filter(file => file !== fileToDelete));
    }

    const uploadFiles = async (files: FormData) => {
        return await authAxios.post(urls.Upload, files, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    };

    const handleUpload = async () => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        
        try {
            const response = await uploadFiles(formData);
            console.log(response.data);
            dispatch(setSnackbar({
                open: true,
                severity: 'success',
                message: 'アップロードに成功しました。'
            }));
            dispatch(setUploadedData(response.data));
        }
        catch (error) {
            console.log(error);
            dispatch(setSnackbar({
                open: true,
                severity: 'error',
                message: 'アップロードに失敗しました。'
            }));
        }
    }
    
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const dropzoneStyles: DropzoneRootProps = {
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
    };

    return (
        <Box>
            <Container component={"main"} maxWidth="md">
                <Box {...getRootProps({ style: dropzoneStyles })} sx={{ mb: 2 }}>
                    <input {...getInputProps()} />
                    <Typography component={"h1"} variant='h6'>
                        テキストファイルをアップロードしてください。
                    </Typography>
                    <FileUploadIcon sx={{ fontSize: 50 }} />
                </Box>
                <Button variant='contained' onClick={handleUpload}>アップロード</Button>

                <List>
                    {files.map((file: File, index: number) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={file.name}
                                secondary={`サイズ: ${file.size} バイト`}
                            />
                            <IconButton color='error' onClick={() => handleDelete(file)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Container>
        </Box>
    );
};

export default UploadText;