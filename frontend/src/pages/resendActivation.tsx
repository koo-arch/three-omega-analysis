import React from 'react';
import axios from '@/api/axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux/reduxHooks';
import { setSnackbar } from '@/redux/slices/snackbarSlice';
import CustomSnackbar from '@/components/customSnackbar';
import urls from '@/api/urls';
import {
    Button,
    Box,
    Container,
    Typography,
    TextField,
    Avatar,
    Grid,
} from '@mui/material';
import CustomLink from '@/components/customLink';
import EmailIcon from '@mui/icons-material/Email';

interface ActivationData {
    email: string;
}

const ResendActivation: React.FC = () => {
    const navigation = useNavigate();
    const dispatch = useAppDispatch();
    const snackbar = useAppSelector(state => state.snackbar);
    const { register, handleSubmit, formState: { errors } } = useForm<ActivationData>();

    const resendEmail = async (data: ActivationData) => {
        return await axios.post(urls.ResendActivation, data);
    }

    const onSubmit: SubmitHandler<ActivationData> = (data) => {
        resendEmail(data)
            .then(res => {
                console.log(res);
                console.log("アカウント本登録メール再送信成功");
                dispatch(setSnackbar({
                    open: true,
                    severity: "success",
                    message: "アカウント本登録メールを再送しました。メールを確認してください。",
                }))
                navigation('/activate/send');
            })
            .catch(err => {
                console.log(err.response.data);
                dispatch(setSnackbar({
                    open: true,
                    severity: "error",
                    message: "アカウント本登録メールの再送に失敗しました。再度お試しください。",
                }))
            })
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
                        <EmailIcon />
                    </Avatar>
                    <Typography component={"h1"} variant='h5'>
                        メール再送信
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
        </div>
    )
}

export default ResendActivation;