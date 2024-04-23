import React from 'react';
import { useAppSelector } from '../hooks/redux/reduxHooks';
import { useFetchSetting } from '../hooks/analysis/useFetchSetting';
import CustomSnackbar from '../components/customSnackbar';
import Loading from '../components/loading';
import UpdateSetting from '../features/setting/updateSetting';
import DeleteSetting from '../features/setting/deleteSetting';
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Divider
} from '@mui/material';

const SettingList: React.FC = () => {
    useFetchSetting();

    const setting = useAppSelector(state => state.setting);
    const snackbar = useAppSelector(state => state.snackbar);
    const settingData = setting.data;
    const isLoading = setting.isLoading;

    return (
        <div>
            <Container maxWidth="md">
                <Box>
                    <Typography variant='h3'>設定一覧</Typography>
                    {isLoading && <Loading open={isLoading}/>}
                    {!isLoading && settingData && settingData.map((item, index) => (
                        <Card key={index} sx={{ my: 2 }}>
                            <CardContent>
                                <Box>
                                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {item.name}
                                    </Typography>
                                    <Divider sx={{ mb: 1 }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                dRdT
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {item.dRdT}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                長さ
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {item.length}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                            </CardContent>
                            <CardActions>
                                <UpdateSetting {...item}/>
                                <DeleteSetting id={item.id}/>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            </Container>
            <CustomSnackbar {...snackbar} />
        </div>
    )
}

export default SettingList;