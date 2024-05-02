import React, { useState } from 'react';
import { useAuthAxios } from '@/hooks/auth/useAuthAxios';
import { useAppDispatch, useAppSelector } from '@/hooks/redux/reduxHooks';
import { useForm, SubmitHandler } from 'react-hook-form';
import { setSnackbar } from '@/redux/slices/snackbarSlice';
import { setPostFlag } from '@/redux/slices/postFlagSlice';
import FormDialog from '@/components/formDialog';
import { useErrorMessage } from '@/hooks/utils/errorHandler';
import urls from '@/api/urls';
import EditIcon from '@mui/icons-material/Edit';
import { TextField, Grid, IconButton } from '@mui/material';

interface UpdateSettingProps {
    id: number;
    name: string;
    dRdT: number;
    length: number;
}

const UpdateSetting: React.FC<UpdateSettingProps> = ({id, name, dRdT, length}) => {
    const dispatch = useAppDispatch();
    const authAxios = useAuthAxios();
    const { register, handleSubmit, clearErrors, setError, formState: { errors } } = useForm<UpdateSettingProps>();
    const postFlag = useAppSelector(state => state.postFlag.flag);
    const [open, setOpen] = useState(false);
    const errorMessage = useErrorMessage<UpdateSettingProps>();

    const openDialog = () => setOpen(true);
    const closeDialog = () => setOpen(false);

    const putSetting = async (data: UpdateSettingProps) => {
        return await authAxios.put(`${urls.Setting}${id}/`, data);
    }

    const onSubmit: SubmitHandler<UpdateSettingProps> = (data) => {
        clearErrors();
        putSetting(data)
            .then(res => {
                dispatch(setSnackbar({
                    open: true,
                    severity: "success",
                    message: "設定を更新しました。"
                }));
                dispatch(setPostFlag({ flag: !postFlag }));
                closeDialog();
            })
            .catch(err => {
                dispatch(setSnackbar({
                    open: true,
                    severity: "error",
                    message: "設定の更新に失敗しました。"
                }));
                errorMessage(err.response.data, setError, "設定の更新に失敗しました。");
            });
    }


    return (
        <div>
            <IconButton color="primary" onClick={openDialog}>
                <EditIcon />
            </IconButton>
            <FormDialog
                open={open}
                onClose={closeDialog}
                color="primary"
                title="設定の更新"
                buttonText="更新"
            >
                <form id="dialog-form" onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        fullWidth
                        label="名前"
                        margin='normal'
                        required
                        defaultValue={name}
                        {...register("name", { required: "名前を入力してください" })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <TextField
                                fullWidth
                                required
                                label="dRdT"
                                margin='normal'
                                defaultValue={dRdT}
                                error={!!errors.dRdT}
                                helperText={errors.dRdT?.message}
                                {...register("dRdT", { required: "dRdTを入力してください" })}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                fullWidth
                                required
                                label="length"
                                margin='normal'
                                defaultValue={length}
                                error={!!errors.length}
                                helperText={errors.length?.message}
                                {...register("length", { required: "lengthを入力してください" })}
                            />
                        </Grid>
                    </Grid>
                </form>
            </FormDialog>
        </div>
    )
}

export default UpdateSetting;