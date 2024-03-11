import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../../features/analysis/analysis';
import { useAppSelector } from '../../hooks/redux/reduxHooks';
import { useFetchSetting } from '../../hooks/analysis/useFetchSetting';
import DropdownSelect from '../../components/dropdownSelect';
import { TextField, Grid, FormControl, Container } from '@mui/material';

const ValueSetting: React.FC = () => {
    useFetchSetting();

    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const setting = useAppSelector(state => state.setting.data);
    const names = [...new Set(setting?.map(item => item.name))];
    const [selectedName, setSelectedName] = useState<string>("");
    const selectedObj = setting?.find(item => item.name === selectedName);
    const { register, setValue, watch, formState: { errors } } = useFormContext<FormValues>();

    // フォーカス状態を管理するための状態変数
    const [isFocused, setIsFocused] = useState({ dRdT: false, length: false });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedName(e.target.value);
    }

    useEffect(() => {
        if (selectedObj) {
            setValue("dRdT", selectedObj.dRdT);
            setValue("length", selectedObj.length);
        } else {
            setValue("dRdT", undefined);
            setValue("length", undefined);
        }
    },[selectedName, setValue])
    
    return (
        <Container component={"main"} maxWidth="md">
            {isAuthenticated &&
                <FormControl
                    fullWidth
                    margin='normal'
                >
                    <DropdownSelect
                        label="設定"
                        value={selectedName}
                        onChange={handleChange}
                        items={names}
                        error={false}
                        helperText=""
                    />
                </FormControl>
            }
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <TextField
                        fullWidth
                        required
                        label="dRdT"
                        margin='normal'
                        error={!!errors.dRdT}
                        helperText={errors.dRdT?.message}
                        {...register("dRdT")}
                        InputLabelProps={{
                            shrink: isFocused.dRdT || !!watch("dRdT"), // dRdTが存在する場合にtrue
                        }}
                        InputProps={{
                            onFocus: () => setIsFocused({ ...isFocused, dRdT: true }),
                            onBlur: () => setIsFocused({ ...isFocused, dRdT: false }),
                        }}
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        fullWidth
                        required
                        label="長さ"
                        margin='normal'
                        error={!!errors.length}
                        helperText={errors.length?.message}
                        {...register("length")}
                        InputLabelProps={{
                            shrink: isFocused.length || !!watch("length"), // lengthが存在する場合にtrue
                        }}
                        InputProps={{
                            onFocus: () => setIsFocused({ ...isFocused, length: true }),
                            onBlur: () => setIsFocused({ ...isFocused, length: false }),
                        }}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

export default ValueSetting;