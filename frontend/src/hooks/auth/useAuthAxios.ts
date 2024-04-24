import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { axiosConfig } from '@/api/axios';
import axios, { AxiosInstance } from 'axios';
import { useRefreshToken } from './useRefreshToken';

const authAxios: AxiosInstance = axios.create(axiosConfig);

export const useAuthAxios = (): AxiosInstance => {
    const [cookies, ] = useCookies(['accesstoken', 'refreshtoken']);
    const refresh = useRefreshToken();

    useEffect(() => {
        const requestInterceptor = authAxios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization'] && !!cookies.accesstoken) {
                    config.headers['Authorization'] = `JWT ${cookies.accesstoken}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        const responseInterceptor = authAxios.interceptors.response.use(
            response => response,
            async error => {
                const prevRequest = error?.config;
                console.log(error.response);
                if (error?.response?.status === 403 && !prevRequest.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    if (newAccessToken === null) {
                        return Promise.reject(error);
                    }
                    prevRequest.headers['Authorization'] = `JWT ${newAccessToken}`;
                    return authAxios(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            authAxios.interceptors.request.eject(requestInterceptor);
            authAxios.interceptors.response.eject(responseInterceptor);
        };
    }, [cookies, refresh]);

    return authAxios;
}