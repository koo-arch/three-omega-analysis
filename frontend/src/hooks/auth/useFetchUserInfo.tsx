import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useAuthAxios } from './useAuthAxios';
import { useLogout } from './useLogout';
import { useAppDispatch } from '../redux/reduxHooks';
import { loginSuccess } from '../../redux/authSlice';
import { setSnackbar } from '../../redux/snackbarSlice';
import urls from '../../api/urls';

export const useFetchUserInfo = (): void => {
    const [cookies, ] = useCookies(['accesstoken', 'refreshtoken']);
    const authAxios = useAuthAxios();
    const dispatch = useAppDispatch();
    const logout = useLogout();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await authAxios.get(urls.UserInfo);
                dispatch(loginSuccess({
                    id: response.data.id,
                    username: response.data.username,
                    email: response.data.email,
                }));
            } catch (error) {
                console.log(error);
                logout();
                dispatch(setSnackbar({
                    open: true,
                    severity: 'error',
                    message: "エラーが発生しました。"
                }));
            }
        }
        if (!!cookies.accesstoken) {
            fetchUserInfo();
        }
    },[cookies, dispatch])
}