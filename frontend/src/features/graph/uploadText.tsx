import React, { useCallback } from 'react';
import { useAuthAxios } from '../../hooks/auth/useAuthAxios';
import { useAppDispatch } from '../../hooks/redux/reduxHooks';
import { setSnackbar } from '../../redux/slices/snackbarSlice';
import { setUploadedData } from '../../redux/slices/uploadedDataSlice';
import { useNavigate } from 'react-router-dom';
import urls from '../../api/urls';
import { useDropzone, DropzoneRootProps } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ErrorIcon from '@mui/icons-material/Error';

const UploadText: React.FC = () => {
    const dispatch = useAppDispatch();
    const authAxios = useAuthAxios();
    const navigation = useNavigate();

    
    const uploadFiles = async (files: FormData) => {
        return await authAxios.post(urls.Upload, files, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    };
    
    const handleUpload = async (fileToUpload: File[]) => {
        const formData = new FormData();
        fileToUpload.forEach(file => {
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
        } catch (error: any) {
            console.log(error);
            
            dispatch(setSnackbar({
                open: true,
                severity: 'error',
                message: 'アップロードに失敗しました。'
            }));
            
            if (error?.response?.status === 403) {
                navigation('/login');
                dispatch(setSnackbar({
                    open: true,
                    severity: 'error',
                    message: 'ファイルをアップロードするにはログインしてください。'
                }));
            }
        }
    }

    // ファイルがドロップされたときに実行
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (isDragReject) {
            return;
        }
        handleUpload(acceptedFiles);
    }, []);
    
    const { fileRejections, isDragReject, getRootProps, getInputProps } = useDropzone({
        onDrop,
        // ドロップされたファイルがテキストファイルでない場合はエラーメッセージを表示
        accept: {
            'text/plain': ['.txt']
        }
    });

    const fileRejectionItems = fileRejections.map(({ file, errors }, index) => (
        <div key={index}>
            {errors.map(e => 
                <div key={e.code} style={{ color: 'red' }}>
                    <ErrorIcon style={{ fontSize: '1rem', verticalAlign: 'middle' }} />
                    <span style={{ marginLeft: '0.5rem' }}>{file.name}は許可された拡張子ではありません</span>
                </div>
            )}
        </div>
    ));

    const dropzoneStyles: DropzoneRootProps = {
        border: '2px dashed #cccccc',
        borderRadius: '10px',
        padding: '40px',
        textAlign: 'center',
        cursor: 'pointer',
    };

    return (
        <Box>
            <div>
                <Box {...getRootProps({ style: dropzoneStyles })} sx={{ mb: 2 }}>
                    <input {...getInputProps()} />
                    <FileUploadIcon sx={{ fontSize: 100 }} />
                    <Typography component={"h1"} variant='h6'>
                        テキストファイルをドラッグ&ドロップ
                    </Typography>
                    <Typography component={"p"} variant='body2'>
                        またはクリックしてファイルを選択
                    </Typography>
                </Box>
                {fileRejectionItems}
            </div>
        </Box>
    );
};

export default UploadText;