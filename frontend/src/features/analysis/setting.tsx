import React, { useState } from 'react';
import { useAppSelector } from '../../hooks/redux/reduxHooks';
import { useFetchSetting } from '../../hooks/analysis/useFetchSetting';
import DropdownSelect from '../../components/dropdownSelect';
import { TextField, Grid, FormControl } from '@mui/material';

const Setting: React.FC = () => {
    useFetchSetting();

    const setting = useAppSelector(state => state.setting.data);
    const names = [...new Set(setting?.map(item => item.name))];
    const [selectedName, setSelectedName] = useState<string>("");
    const selectedObj = setting?.find(item => item.name === selectedName);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedName(e.target.value);
    }
    
    return (
        <div>
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
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <TextField
                        fullWidth
                        label="dRdT"
                        margin='normal'
                        value={selectedObj?.dRdT || ""}
                        error={false}
                        helperText=""
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        fullWidth
                        label="金線長さ"
                        margin='normal'
                        value={selectedObj?.length || ""}
                        error={false}
                        helperText=""
                    />
                </Grid>
            </Grid>
        </div>
    )
}

export default Setting;