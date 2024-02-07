import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/reduxHooks';
import { logoutSuccess } from '../../redux/slices/authSlice';
import { setSnackbar } from '../../redux/slices/snackbarSlice';

export const useLogout = ():() => void => {
    const navigation = useNavigate();
    const dispatch = useAppDispatch();
    const [ , ,removeCookie] = useCookies(['accesstoken', 'refreshtoken']);

    const logout = () => {
        try {
            // cookieの削除
            removeCookie('accesstoken', { path: '/' });
            removeCookie('refreshtoken', { path: '/' });

            // ログアウト成功のアクション
            dispatch(logoutSuccess());

            // ログアウト成功のスナックバー
            dispatch(setSnackbar({
                open: true,
                severity: "success",
                message: 'ログアウトしました',
            }));
            navigation('/');
        } catch (error) {
            console.log(error);

            // エラーメッセージ
            dispatch(setSnackbar({
                open: true,
                severity: "error",
                message: 'Logout failed',
            }));
        }
    }

    return logout;
}