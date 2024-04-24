import React from 'react';
import { useAppSelector } from '../../../hooks/redux/reduxHooks';
import RegisterSetting from '../../setting/registerSetting';
import { Grid, Container, Typography } from '@mui/material';

const Configuration: React.FC = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    
    return (
        <Container>
            <Grid container>
                <Grid item xs>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>測定設定</Typography>
                </Grid>
                {isAuthenticated &&
                    <Grid>
                        <RegisterSetting />
                    </Grid>
                }
            </Grid>
            {isAuthenticated ? 
                <Typography variant='body2' gutterBottom>設定を入力または選択してください</Typography> : 
                <Typography variant='body2' gutterBottom>ログインして設定を入力してください</Typography>
            }
        </Container>
    )
}

export default Configuration;