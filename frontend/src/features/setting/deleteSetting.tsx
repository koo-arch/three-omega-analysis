import React, { useState } from 'react';
import { useAuthAxios } from '../../hooks/auth/useAuthAxios';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/reduxHooks';
import { useForm, SubmitHandler } from 'react-hook-form';
import { setSnackbar } from '../../redux/slices/snackbarSlice';
import { setPostFlag } from '../../redux/slices/postFlagSlice';
import FormDialog from '../../components/formDialog';
import { useErrorMessage } from '../../hooks/utils/errorHandler';
import urls from '../../api/urls';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, DialogContentText } from '@mui/material';

interface DeleteSettingProps {
    id: number;
}

const DeleteSetting: React.FC<DeleteSettingProps> = ({id}) => {
    const dispatch = useAppDispatch();
    const authAxios = useAuthAxios();
    const { handleSubmit, setError, formState: { errors } } = useForm<DeleteSettingProps>();
    const postFlag = useAppSelector(state => state.postFlag.flag);
    const [open, setOpen] = useState(false);
    const errorMessage = useErrorMessage<DeleteSettingProps>();

    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    const deleteSetting = async () => {
        return await authAxios.delete(`${urls.Setting}${id}/`);
    }

    const onSubmit = () => {
        deleteSetting()
            .then(res => {
                dispatch(setSnackbar({
                    open: true,
                    severity: "success",
                    message: "設定を削除しました。"
                }));
                dispatch(setPostFlag({ flag: !postFlag }));
                closeDialog();
            })
            .catch(err => {
                dispatch(setSnackbar({
                    open: true,
                    severity: "error",
                    message: "設定の削除に失敗しました。"
                }));
                errorMessage(err.response.data, setError, "設定の削除に失敗しました。");
            });
    }

    return (
        <div>
            <IconButton color="error" onClick={openDialog}>
                <DeleteIcon />
            </IconButton>
            <FormDialog
                open={open}
                onClose={closeDialog}
                title="設定の削除"
                color="error"
                buttonText='削除'
            >
                <form id="dialog-form" onSubmit={handleSubmit(onSubmit)}>
                    <DialogContentText color="error">
                        この設定を削除してよろしいですか？
                    </DialogContentText>
                </form>
            </FormDialog>
        </div>
    )
}

export default DeleteSetting;