import React, { useState } from 'react';
import { useAuthAxios } from '../../hooks/auth/useAuthAxios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/reduxHooks';
import { setSnackbar } from '../../redux/slices/snackbarSlice';
import { setPostFlag } from '../../redux/slices/postFlagSlice';
import urls from '../../api/urls';
import FormDialog from '../../components/formDialog';
import { useErrorMessage } from '../../hooks/utils/errorHandler';
import { TextField, Button, Grid } from '@mui/material';

interface SettingForm {
    name: string;
    dRdT: number;
    length: number;
}

const RegisterSetting: React.FC = () => {
    const dispatch = useAppDispatch();
    const authAxios = useAuthAxios();
    const { register, handleSubmit, clearErrors, setError, formState: { errors } } = useForm<SettingForm>();
    const [open, setOpen] = useState(false);
    const postFlag = useAppSelector(state => state.postFlag.flag);
    const errorMessage = useErrorMessage<SettingForm>();

    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    const postSetting = async (data: SettingForm) => {
        return await authAxios.post(urls.Setting, data);
    }

    const onSubmit: SubmitHandler<SettingForm> = (data) => {
        clearErrors();
        postSetting(data)
            .then(res => {
                dispatch(setSnackbar({
                    open: true,
                    severity: "success",
                    message: "設定を登録しました。"
                }));
                dispatch(setPostFlag({ flag: !postFlag }));
                closeDialog();
            })
            .catch(err => {
                dispatch(setSnackbar({
                    open: true,
                    severity: "error",
                    message: "設定の登録に失敗しました。"
                }));
                errorMessage(err.response.data, setError, "設定の登録に失敗しました。");
            });
    }

    return (
        <div>
            <Button variant="contained" onClick={openDialog}>設定の登録</Button>
            <FormDialog
                open={open}
                onClose={closeDialog}
                color="primary"
                title="設定の登録"
                buttonText="登録"
            >
                <form id="dialog-form" onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        label="名前"
                        margin='normal'
                        required
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <TextField
                                fullWidth
                                label="dRdT"
                                margin='normal'
                                required
                                {...register("dRdT")}
                                error={!!errors.dRdT}
                                helperText={errors.dRdT?.message}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth
                                label="金線長さ"
                                margin='normal'
                                required
                                {...register("length")}
                                error={!!errors.length}
                                helperText={errors.length?.message}
                            />
                        </Grid>
                    </Grid>
                </form>
            </FormDialog>
        </div>
    )
}

export default RegisterSetting;