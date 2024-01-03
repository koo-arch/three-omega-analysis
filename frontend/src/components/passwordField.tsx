import React, { useState, forwardRef } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordFieldProps {
    label: string;
    required?: boolean;
    error?: boolean;
    helperText?: string | false;
    margin?: "none" | "dense" | "normal";
    fullWidth?: boolean;
    [x: string]: any;
}

const PasswordField: React.FC<PasswordFieldProps & React.RefAttributes<HTMLInputElement>> = forwardRef<HTMLInputElement, PasswordFieldProps>((props,ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <TextField
            {...props}
            type={showPassword ? 'text' : 'password'}
            inputRef={ref} //refをinput要素に割り当てる
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            tabIndex={-1} //tabキーの操作から除外
                            edge="end"
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    )
});

export default PasswordField;