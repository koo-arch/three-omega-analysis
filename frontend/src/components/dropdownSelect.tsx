import React from 'react';
import { MenuItem, TextField } from '@mui/material';

interface DropdownSelectProps {
    label: string;
    value: string;
    variant: "standard" | "outlined" | "filled";
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    items: string[];
    error: boolean;
    helperText: string;
}

const DropdownSelect: React.FC<DropdownSelectProps> = (props) => {
    const { label, value, variant, onChange, items, error, helperText } = props;
    return (
        <TextField
            select
            label={label}
            value={value}
            variant={variant}
            onChange={onChange}
            error={error}
            helperText={helperText}
        >
            <MenuItem value="">選択してください</MenuItem>
            {items.map((item: string, index: number) => (
                <MenuItem key={index} value={item}>
                    {item}
                </MenuItem>
            ))}
        </TextField>
    );
}

export default DropdownSelect;