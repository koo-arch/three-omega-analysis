import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuthAxios } from '@/hooks/auth/useAuthAxios';
import { useAppDispatch } from '@/hooks/redux/reduxHooks';
import { setSnackbar } from '@/redux/slices/snackbarSlice';
import { useLogout } from '@/hooks/auth/useLogout';
import urls from '@/api/urls';
import FormDialog from '@/components/formDialog';
import PasswordField from '@/components/passwordField';
import { Button, Container, DialogContentText, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useErrorMessage } from '@/hooks/utils/errorHandler';

interface DeleteAccountData {
    current_password: string;
}

const DeleteAccount: React.FC = () => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const { register, handleSubmit, clearErrors, setError, formState: { errors } } = useForm<DeleteAccountData>();
    const errorMessage = useErrorMessage<DeleteAccountData>();
    const dispatch = useAppDispatch();
    const authAxios = useAuthAxios();
    const logout = useLogout();

    const openDialog = () => setDialogIsOpen(true);
    const closeDialog = () => setDialogIsOpen(false);

    const deleteAccount = async (data: DeleteAccountData) => {
        return await authAxios.delete(urls.UserInfo, { data: data });
    }

    const onSubmit: SubmitHandler<DeleteAccountData> = (data) => {
        clearErrors();
        deleteAccount(data)
            .then(res => {
                console.log("アカウント削除成功");
                closeDialog();
                logout();
                dispatch(setSnackbar({
                    open: true,
                    severity: "success",
                    message: "アカウントを削除しました。",
                }))
            })
            .catch(err => {
                const errRes = err.response.data;
                console.log(errRes);
                const message = "アカウント削除に失敗しました。再度お試しください。";
                errorMessage(errRes, setError, message)
            })
    }
    return (
        <div>
            <Typography variant='body1'>
                アカウントとデータをすべて削除します。
            </Typography>
            <Container maxWidth="xs">
                <Button
                    startIcon={<DeleteIcon />}
                    variant='contained'
                    color="error"
                    size="large"
                    fullWidth
                    onClick={openDialog}
                    sx={{ mt: 3, mb: 2 }}
                >
                    アカウント削除
                </Button>
            </Container>
            <FormDialog
                open={dialogIsOpen}
                onClose={closeDialog}
                title="アカウント削除"
                buttonText="削除"
                color="error"
            >
                <form id="dialog-form" onSubmit={handleSubmit(onSubmit)}>
                    <DialogContentText color="error">
                        アカウントとデータを全て削除します。
                        よろしいですか？
                    </DialogContentText>
                    <PasswordField
                        required
                        error={!!errors.current_password}
                        margin='normal'
                        fullWidth
                        label="パスワード"
                        helperText={!!errors.current_password && errors.current_password.message}
                        {...register('current_password', { required: "パスワードを入力してください" })}
                    />
                </form>
            </FormDialog>
        </div>
    )
}

export default DeleteAccount;