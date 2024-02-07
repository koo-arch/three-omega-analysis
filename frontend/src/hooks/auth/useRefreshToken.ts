import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../redux/reduxHooks';
import { setSnackbar } from '../../redux/slices/snackbarSlice';
import axios from '../../api/axios';
import urls from '../../api/urls';
import { useLogout } from './useLogout';

export const useRefreshToken = ():() => Promise<string | null> => {
    const [cookies, setCookie] = useCookies(['accesstoken', 'refreshtoken']);
    const dispatch = useAppDispatch();
    const logout = useLogout();

    const refresh = async () : Promise<string | null> => {
        // cookieに保存されたrefresh_tokenを送付してaccess_tokenを取得する
        try {
            const response = await axios.post(urls.Refresh, {
                refresh: cookies.refreshtoken,
            });
            setCookie('accesstoken', response.data.access, { path: '/' });
            console.log(response);

            return response.data.access;
        } catch (error) {
            logout();
            dispatch(setSnackbar({
                open: true,
                severity: "error",
                message: 'ログインしてください',
            }));

            return null;
        }
    };

    return refresh;
}