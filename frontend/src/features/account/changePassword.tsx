import React from 'react';
import { useCookies } from 'react-cookie';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuthAxios } from '@/hooks/auth/useAuthAxios';
import urls from '@/api/urls';
import { useAppDispatch } from '@/hooks/redux/reduxHooks';
import { setSnackbar } from '@/redux/slices/snackbarSlice';
import PasswordField from '@/components/passwordField';
import { Container, Button, Divider, Typography } from '@mui/material';
import { useErrorMessage } from '@/hooks/utils/errorHandler';

interface ChangePasswordData {
    current_password: string;
    new_password: string;
    re_new_password: string;
}

const ChangePassword: React.FC = () => {
    const [cookies, ] = useCookies(['accesstoken', 'refreshtoken']);
    const { register, handleSubmit, getValues, clearErrors, setError, formState: { errors } } = useForm<ChangePasswordData>();
    const errorMessage = useErrorMessage<ChangePasswordData>();
    const dispatch = useAppDispatch();
    const authAxios = useAuthAxios();

    const postPassword = async (data: ChangePasswordData) => {
        return await authAxios.post(urls.ChangePassword, data);
    }

    const onSubmit: SubmitHandler<ChangePasswordData> = (data) => {
        clearErrors();
        postPassword(data)
            .then(res => {
                console.log(data);
                console.log("パスワード変更成功");
                dispatch(setSnackbar({
                    open: true,
                    severity: "success",
                    message: "パスワードを変更しました",
                }))
            })
            .catch(err => {
                const errRes = err.response.data;
                console.log(errRes);
                const message = "パスワード変更に失敗しました。再度お試しください。";
                errorMessage(errRes, setError, message);
            })
    }

    return (
        <div>
            <Typography variant='body1'>
                現在のパスワード、新しいパスワードを入力してください。
            </Typography>
            <Container maxWidth="xs">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <PasswordField
                        required
                        error={!!errors.current_password}
                        margin="normal"
                        fullWidth
                        label="現在のパスワード"
                        helperText={!!errors.current_password && errors.current_password.message}
                        {...register('current_password', {
                            required: "パスワードを入力してください",
                            minLength: { value: 8, message: `8文字以上で入力してください。` },
                        })
                        }
                    />
                    <Divider />
                    <PasswordField
                        required
                        error={!!errors.new_password}
                        margin="normal"
                        fullWidth
                        label="新しいパスワード"
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
                        label="新しいパスワード(確認)"
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
                        変更
                    </Button>
                </form>
            </Container>
        </div>
    )
}

export default ChangePassword;