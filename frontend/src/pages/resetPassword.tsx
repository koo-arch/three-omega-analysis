import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuthAxios } from '../hooks/auth/useAuthAxios';
import { useAppDispatch, useAppSelector } from '../hooks/redux/reduxHooks';
import { setSnackbar } from '../redux/snackbarSlice';
import CustomSnackbar from '../components/customSnackbar';
import urls from '../api/urls';
import {
    Button,
    Box,
    Container,
    Typography,
    TextField,
    Avatar,
    Grid,
} from '@mui/material';
import CustomLink from '../components/customLink';
import LockResetIcon from '@mui/icons-material/LockReset';

interface ResetPasswordData {
    email: string;
}

const ResetPassword: React.FC = () => {
    const dispatch = useAppDispatch();
    const snackbar = useAppSelector(state => state.snackbar);
    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordData>();
    const authAxios = useAuthAxios();

    const postEmail = async (data: ResetPasswordData) => {
        return await authAxios.post(urls.ResetPassword, data);
    }

    const onSubmit: SubmitHandler<ResetPasswordData> = (data) => {
        postEmail(data)
            .then(res => {
                console.log(res);
                console.log("パスワードリセットメール送信成功");
                dispatch(setSnackbar({
                    open: true,
                    severity: "success",
                    message: "パスワードリセットメールを送信しました。メールを確認してください。",
                }))
            })
            .catch(err => {
                console.log(err.response.data);
                dispatch(setSnackbar({
                    open: true,
                    severity: "error",
                    message: "パスワードリセットメールの送信に失敗しました。再度お試しください。",
                }))
            })
    }

    return (
        <>
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
                        パスワードリセット
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            required
                            error={!!errors.email}
                            margin='normal'
                            fullWidth
                            label="メールアドレス"
                            type="email"
                            helperText={!!errors.email && errors.email.message}
                            {...register('email', { required: "メールアドレスを入力してください" })}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            type="submit"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            送信
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <CustomLink to="/login" variant="body2">
                                    ログイン
                                </CustomLink>
                            </Grid>
                            <Grid item>
                                <CustomLink to="/register" variant="body2">
                                    新規登録
                                </CustomLink>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Container>
            <CustomSnackbar {...snackbar} />
        </>
    )
}

export default ResetPassword;