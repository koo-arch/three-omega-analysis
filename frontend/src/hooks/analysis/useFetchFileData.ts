import { useEffect } from 'react';
import { useAuthAxios } from '@/hooks/auth/useAuthAxios';
import { useAppDispatch } from '@/hooks/redux/reduxHooks';
import { useCookies } from 'react-cookie';
import { setSnackbar } from '@/redux/slices/snackbarSlice';
import { setUploadedData } from '@/redux/slices/uploadedDataSlice';
import urls from '@/api/urls';

export const useFetchFileData = () : void => {
    const [cookies, ] = useCookies(['accesstoken', 'refreshtoken']);
    const authAxios = useAuthAxios();
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        const fetchFileData = async () => {
            try {
                const response = await authAxios.get(urls.GetGraph);
                dispatch(setUploadedData(response.data[0]));
            }
            catch (error) {
                console.log(error);
                dispatch(setSnackbar({
                    open: true,
                    severity: 'error',
                    message: "エラーが発生しました。"
                }));
            }
        }
        if (!!cookies.accesstoken) {
            fetchFileData();
        }
    }, [dispatch])
}