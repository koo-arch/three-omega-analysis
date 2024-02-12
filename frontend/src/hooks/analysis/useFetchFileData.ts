import { useEffect } from 'react';
import axios from '../../api/axios'
import { useAppDispatch } from '../redux/reduxHooks';
import { setSnackbar } from '../../redux/slices/snackbarSlice';
import { setUploadedData } from '../../redux/slices/uploadedDataSlice';
import urls from '../../api/urls';

export const useFetchFileData = () : void => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchFileData = async () => {
            try {
                const response = await axios.get(urls.Upload);
                dispatch(setUploadedData(response.data));
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
        fetchFileData();
    }, [dispatch])
}