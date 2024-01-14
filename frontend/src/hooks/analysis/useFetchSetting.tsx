import { useEffect } from 'react';
import { useAuthAxios } from '../auth/useAuthAxios';
import { useAppDispatch } from '../redux/reduxHooks';
import { setSnackbar } from '../../redux/snackbarSlice';
import { fetchSettingSuccess } from '../../redux/settingSlice';
import urls from '../../api/urls';

export const useFetchSetting = (): void => {
    const authAxios = useAuthAxios();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                const response = await authAxios.get(urls.Setting);
                dispatch(fetchSettingSuccess(response.data));
            } catch (error) {
                console.log(error);
                dispatch(setSnackbar({
                    open: true,
                    severity: 'error',
                    message: "エラーが発生しました。"
                }));
            }
        }
        fetchSetting();
    },[dispatch])
}