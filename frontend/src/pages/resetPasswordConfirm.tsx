import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthAxios } from '../hooks/auth/useAuthAxios';
import { useAppDispatch, useAppSelector } from '../hooks/redux/reduxHooks';
import { setSnackbar } from '../redux/slices/snackbarSlice';
import CustomSnackbar from '../components/customSnackbar';
import PasswordField from '../components/passwordField';
import urls from '../api/urls';
import {
    Button,
    Box,
    Container,
    Typography,
    Avatar,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';

interface ResetPasswordConfirmData {
    new_password: string;
    re_new_password: string;
    uid?: string;
    token?: string
}

const ResetPasswordConfirm: React.FC = () => {
    const authAxios = useAuthAxios();
    const dispatch = useAppDispatch();
    const navigation = useNavigate();
    const { uid, token } = useParams();
    const snackbar = useAppSelector(state => state.snackbar);
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<ResetPasswordConfirmData>();

    const postNewPassword = async (data: ResetPasswordConfirmData) => {
        data.uid = uid;
        data.token = token;
        return await authAxios.post(urls.ResetPasswordConfirm, data);
    }

    const onSubmit: SubmitHandler<ResetPasswordConfirmData> = async (data) => {
        postNewPassword(data)
            .then(res => {
                console.log(res)
                console.log("メール送信完了");
                dispatch(setSnackbar({
                    open: true,
                    severity: "success",
                    message: "パスワード変更が完了しました。"
                }))
                navigation('/login');
            })
            .catch(err => {
                const errRes = err.response.data
                console.log(err.response.data)
                dispatch(setSnackbar({
                    open: true,
                    severity: "error",
                    message: `パスワード変更に失敗しました。再度やり直してください。(code:${err.response.status})`
                }))
                navigation('/password/reset');
            });
    }
    return (
        <div>
            <Container component={"main"} maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockResetIcon />
                    </Avatar>
                    <Typography component={"h1"} variant='h5'>
                        新しいパスワードの設定
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <PasswordField
                            required
                            error={!!errors.new_password}
                            margin="normal"
                            fullWidth
                            label="パスワード"
                            helperText={!!errors.new_password && errors.new_password.message}
                            {...register('new_password', {
                                required: "パスワードを入力してください",
                                minLength: { value: 8, message: `8文字以上で入力してください。` },
                            })
                            }
                        />
                        <PasswordField
                            required
                            error={!!errors.re_new_password}
                            margin="normal"
                            fullWidth
                            label="パスワード(確認)"
                            helperText={!!errors.re_new_password && errors.re_new_password.message}
                            {...register('re_new_password', {
                                required: "パスワードを再入力してください",
                                validate: (value) => {
                                    return (
                                        value === getValues('new_password') || "パスワードが一致しません"
                                    )
                                }
                            })
                            }
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            type="submit"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            送信
                        </Button>
                    </form>
                </Box>
            </Container>
            <CustomSnackbar {...snackbar} />
        </div>
    )
}   

export default ResetPasswordConfirm;