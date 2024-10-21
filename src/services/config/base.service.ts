import { toggleLoading } from 'app';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiRequestModel } from 'models';
import { toast } from 'react-toastify';
import { getItemInLocalStorage, removeItemInLocalStorage } from 'utils';
import { store } from "../app/store";
import { DOMAIN_ADMIN, LOCAL_STORAGE } from 'consts';
import { ROUTER_URL } from '../consts/router.const';

export const axiosInstance = axios.create({
    baseURL: DOMAIN_ADMIN,
    headers: {
        'content-type': 'application/json; charset=UTF-8'
    },
    timeout: 300000,
    timeoutErrorMessage: `Connection is timeout exceeded`
});

export const getState = (store: any) => {
    return store.getState();
}

export const BaseService = {
    get<T = any>({ url, isLoading = true, payload, headers }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
        const params = { ...payload }
        for (const key in params) {
            if ((params as any)[key] === '' && (params as any)[key] !== 0) {
                delete (params as any)[key]
            }
        }
        checkLoading(isLoading);
        return axiosInstance.get<T, PromiseState<T>>(
            `${url}`, {
            params: params,
            headers: headers || {}
        })
    },
    post<T = any>({ url, isLoading = true, payload, headers }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
        checkLoading(isLoading);
        return axiosInstance.post<T, PromiseState<T>>(
            `${url}`, payload, {
            headers: headers || {}
        })
    },
    put<T = any>({ url, isLoading = true, payload, headers }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
        checkLoading(isLoading);
        return axiosInstance.put(
            `${url}`, payload, {
            headers: headers || {}
        })
    },
    remove<T = any>({ url, isLoading = true, payload, headers }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
        checkLoading(isLoading);
        return axiosInstance.delete(
            `${url}`, {
            params: payload,
            headers: headers || {}
        })
    },
    getById<T = any>({ url, isLoading = true, payload, headers }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
        checkLoading(isLoading);
        return axiosInstance.get<T, PromiseState<T>>(
            `${url}`, {
            params: payload,
            headers: headers || {}
        })
    },
    uploadMedia(
        url: string,
        file?: any,
        isMultiple: boolean = false,
        isLoading: boolean = true
    ) {
        const formData = new FormData();
        if (isMultiple) {
            for (let i = 0 ; i < file.length ; i++) {
                formData.append("files[]", file[i]);
            }
        } else {
            formData.append("file", file);
        }
        const user: any = getItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
        checkLoading(isLoading);
        return axios({
            method: "post",
            url: `${DOMAIN_ADMIN}${url}`,
            data: formData,
            params: {},
            headers: {
                "content-type": "multipart/form-data",
                "Authorization": `Bearer ${user.access_token}`,
            }
        }).then((res) => {
            store.dispatch(toggleLoading(false));
            return res.data;
        }).catch(error => {
            handleErrorByToast(error);
            return null;
        })
    }
}

const checkLoading = (isLoading: boolean = false) => {
    if (isLoading) store.dispatch(toggleLoading(true));
}

export interface PromiseState<T = unknown> extends AxiosResponse<T> {
    totalItem: number;
}


axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const user: any = getItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
        if (config.headers === undefined) config.headers = {};
        if (user) config.headers['Authorization'] = `Bearer ${user.access_token}`;
        return config;
    },
    (err) => {
        return handleErrorByToast(err);
    }
);

axiosInstance.interceptors.response.use(
    (config) => {
        store.dispatch(toggleLoading(false));
        return Promise.resolve((config));
    },
    (err) => {
        const { response } = err;
        if (response && response.status === 401) {
            setTimeout(() => {
                removeItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN)
                window.location.href = ROUTER_URL.LOGIN;
            }, 2000);
        }
        return handleErrorByToast(err);
    }
)

const handleErrorByToast = (error: any) => {
    const message = error.response?.data?.message ? error.response?.data?.message : error.message;
    toast.error(message);
    store.dispatch(toggleLoading(false));
    return null;
}