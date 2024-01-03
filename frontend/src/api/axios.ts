import axios, { AxiosInstance } from "axios";

export const server: string  = "http://127.0.0.1:8000"

export const axiosConfig = {
    baseURL: `${server}/api/v1/`,
};

const instance: AxiosInstance = axios.create(axiosConfig);

export default instance;