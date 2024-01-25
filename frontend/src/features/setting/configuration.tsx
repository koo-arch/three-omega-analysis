import React from 'react';
import { useAppSelector } from '../../hooks/redux/reduxHooks';
import ValueSetting from './valueSetting';
import RegisterSetting from './registerSetting';
import { Grid, Container, Typography } from '@mui/material';

const Configuration: React.FC = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    
    return (
        <Container>
            <Grid container>
                <Grid item xs>
                    <Typography variant='h3'>値設定</Typography>
                </Grid>
                {isAuthenticated &&
                    <Grid>
                        <RegisterSetting />
                    </Grid>
                }
            </Grid>
            <ValueSetting />
        </Container>
    )
}

export default Configuration;