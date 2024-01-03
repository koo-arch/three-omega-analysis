import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

interface LoadingProps {
    open: boolean;
}

const Loading: React.FC<LoadingProps> = (props) => {
    return (
        <Backdrop open={props.open}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}

export default Loading;