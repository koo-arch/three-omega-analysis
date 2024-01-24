import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomSnackbar from '../components/customSnackbar';
import { useAppDispatch, useAppSelector } from '../hooks/redux/reduxHooks';
import { setSnackbar } from '../redux/slices/snackbarSlice';
import axios from '../api/axios';
import urls from '../api/urls';

const Activation: React.FC = () => {
    const navigation = useNavigate();
    const { uid, token } = useParams();
    const dispatch = useAppDispatch();
    const snackbar = useAppSelector(state => state.snackbar);

    const postActivateToken = async () => {
        return await axios.post(urls.Activation, { uid: uid, token: token });
    }

    useEffect(() => {
        postActivateToken()
            .then(res => {
                console.log(res)
                console.log("アカウント本登録完了")
                dispatch(setSnackbar({
                    open: true,
                    severity: "success",
                    message: "アカウントを本登録が完了しました。",
                }))
                navigation('/login');
            })
            .catch(err => {
                console.log(err.response.data)
                dispatch(setSnackbar({
                    open: true,
                    severity: "error",
                    message: "アカウント本登録に失敗しました。再度お試しください。",
                    }))
                navigation('/activate/resend')
            })
    },[])
    return (
        <div>
            <CustomSnackbar {...snackbar} />
        </div>
    )
}

export default Activation;