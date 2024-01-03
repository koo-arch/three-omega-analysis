import React from 'react';
import axios from '../api/axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux/reduxHooks';
import { setSnackbar } from '../redux/snackbarSlice';
import PasswordField from '../components/passwordField';
import urls from '../api/urls';
import CustomSnackbar from '../components/customSnackbar';
import {
    Button,
    Box,
    Container,
    CssBaseline,
    Typography,
    TextField,
    Avatar,
    Grid,
} from "@mui/material";
import CustomLink from '../components/customLink';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import { useErrorMessage } from '../hooks/utils/errorHandler';

interface RegisterData {
    email: string;
    username: string;
    password: string;
    re_password: string;
}

const Register: React.FC = () => {
    const navigation = useNavigate();
    const dispatch = useAppDispatch();
    const { register, handleSubmit, getValues, clearErrors, setError, formState: { errors } } = useForm<RegisterData>();
    const errorMessage = useErrorMessage<RegisterData>();
    const snackbar = useAppSelector(state => state.snackbar);

    const postRegister = async (data: RegisterData) => {
        return await axios.post(urls.Register, data);
    }

    const onSubmit: SubmitHandler<RegisterData> = (data) => {
        clearErrors();
        postRegister(data)
            .then(res => {
                console.log(res);
                console.log("アカウント登録成功");
                dispatch(setSnackbar({
                    open: true,
                    severity: "success",
                    message: "アカウント登録が完了しました。メールを確認してください。",
                }))
                navigation('/activate/send');
            })
            .catch(err => {
                const errRes = err.response.data;
                console.log(errRes);
                const message = "アカウント登録に失敗しました。再度お試しください。";
                errorMessage(errRes, setError, message);
            })
    }
    return (
        <div>
            <Container component={"main"} maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <HowToRegOutlinedIcon />
                    </Avatar>
                    <Typography component={"h1"} variant='h5'>
                        新規登録
                    </Typography>
                    <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            required
                            error={!!errors.email}
                            margin="normal"
                            fullWidth
                            label="メールアドレス"
                            type="email"
                            helperText={!!errors.email && errors.email.message}
                            {...register('email', { required: "メールアドレスを入力してください" })}
                        />
                        <TextField
                            required
                            error={!!errors.username}
                            margin="normal"
                            fullWidth
                            label="ユーザー名"
                            helperText={!!errors.username && errors.username.message}
                            {...register('username', { required: "ユーザー名を入力してください" })}
                        />
                        <PasswordField
                            required
                            error={!!errors.password}
                            margin="normal"
                            fullWidth
                            label="パスワード"
                            helperText={!!errors.password && errors.password.message}
                            {...register('password', {
                                required: "パスワードを入力してください",
                                minLength: { value: 8, message: `8文字以上で入力してください。` },
                            })
                            }
                        />
                        <PasswordField
                            required
                            error={!!errors.re_password}
                            margin="normal"
                            fullWidth
                            label="パスワード(確認)"
                            helperText={!!errors.re_password && errors.re_password.message}
                            {...register('re_password', {
                                required: "パスワードを再入力してください",
                                validate: (value) => {
                                    return (
                                        value === getValues('password') || "パスワードが一致しません"
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
                            登録
                        </Button>
                    </Box>
                    <Grid container>
                        <Grid item>
                            <CustomLink to="/login" variant="body2">
                                ログイン
                            </CustomLink>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <CustomSnackbar {...snackbar} />
        </div>
    );
};

export default Register;