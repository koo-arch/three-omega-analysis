import React, { useState, useEffect } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import { AnalysisForm } from '@/types/features/analysis';
import { useAppSelector } from '@/hooks/redux/reduxHooks';
import { useFetchSetting } from '@/hooks/analysis/useFetchSetting';
import DropdownSelect from '@/components/dropdownSelect';
import { TextField, Grid, FormControl, Container } from '@mui/material';

const ValueSetting: React.FC = () => {
    useFetchSetting();

    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const setting = useAppSelector(state => state.setting.data);
    const names = [...new Set(setting?.map(item => item.name))];
    const [selectedName, setSelectedName] = useState<string>("");
    const selectedObj = setting?.find(item => item.name === selectedName);
    const { register, setValue, formState: { errors } } = useFormContext<AnalysisForm>();

    const dRdTWatched = useWatch({ name: "dRdT"});
    const lengthWatched = useWatch({ name: "length"});

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
        <Container>
            {isAuthenticated &&
                <FormControl
                    fullWidth
                    margin='dense'
                >
                    <DropdownSelect
                        label="設定"
                        variant="standard"
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
                        variant="standard"
                        margin='dense'
                        error={!!errors.dRdT}
                        helperText={errors.dRdT?.message}
                        {...register("dRdT")}
                        InputLabelProps={{
                            shrink: isFocused.dRdT || !!dRdTWatched, // dRdTが存在する場合にtrue
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
                        variant="standard"
                        margin='dense'
                        error={!!errors.length}
                        helperText={errors.length?.message}
                        {...register("length")}
                        InputLabelProps={{
                            shrink: isFocused.length || !!lengthWatched, // lengthが存在する場合にtrue
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