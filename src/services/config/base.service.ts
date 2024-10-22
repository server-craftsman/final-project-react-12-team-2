import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiRequestModel } from "../../models/api/ApiRequestModel";
import { toast } from "react-toastify";
import {
  getItemInLocalStorage,
  removeItemInLocalStorage,
} from "../../utils/storage";
import { useToggleLoading } from "../../hooks/toggleLoading";
import { DOMAIN_ADMIN, LOCAL_STORAGE } from "../../const/domain";
import { ROUTER_URL } from "../../const/router.path";

export const axiosInstance = axios.create({
  baseURL: DOMAIN_ADMIN,
  headers: {
    "content-type": "application/json; charset=UTF-8",
  },
  timeout: 300000,
  timeoutErrorMessage: `Connection is timeout exceeded`,
});

export const getState = (store: any) => {
  return store.getState();
};

export const BaseService = {
  get<T = any>({
    url,
    isLoading = true,
    payload,
    headers,
    toggleLoading,
  }: Partial<ApiRequestModel> & {
    toggleLoading?: (isLoading: boolean) => void;
  }): Promise<PromiseState<T>> {
    if (toggleLoading) toggleLoading(isLoading);
    return axiosInstance.get<T, PromiseState<T>>(`${url}`, {
      params: payload,
      headers: headers || {},
    });
  },
  post<T = any>({
    url,
    isLoading = true,
    payload,
    headers,
    toggleLoading,
  }: Partial<ApiRequestModel> & {
    toggleLoading?: (isLoading: boolean) => void;
  }): Promise<PromiseState<T>> {
    if (toggleLoading) toggleLoading(isLoading);
    return axiosInstance.post<T, PromiseState<T>>(`${url}`, payload, {
      headers: headers || {},
    });
  },
  put<T = any>({
    url,
    isLoading = true,
    payload,
    headers,
    toggleLoading,
  }: Partial<ApiRequestModel> & {
    toggleLoading?: (isLoading: boolean) => void;
  }): Promise<PromiseState<T>> {
    if (toggleLoading) toggleLoading(isLoading);
    return axiosInstance.put(`${url}`, payload, {
      headers: headers || {},
    });
  },
  remove<T = any>({
    url,
    isLoading = true,
    payload,
    headers,
    toggleLoading,
  }: Partial<ApiRequestModel> & {
    toggleLoading?: (isLoading: boolean) => void;
  }): Promise<PromiseState<T>> {
    if (toggleLoading) toggleLoading(isLoading);
    return axiosInstance.delete(`${url}`, {
      params: payload,
      headers: headers || {},
    });
  },
  getById<T = any>({
    url,
    isLoading = true,
    payload,
    headers,
    toggleLoading,
  }: Partial<ApiRequestModel> & {
    toggleLoading?: (isLoading: boolean) => void;
  }): Promise<PromiseState<T>> {
    if (toggleLoading) toggleLoading(isLoading);
    return axiosInstance.get<T, PromiseState<T>>(`${url}`, {
      params: payload,
      headers: headers || {},
    });
  },
  uploadMedia(
    url: string,
    file?: any,
    isMultiple: boolean = false,
    isLoading: boolean = true,
  ) {
    const formData = new FormData();
    if (isMultiple) {
      for (let i = 0; i < file.length; i++) {
        formData.append("files[]", file[i]);
      }
    } else {
      formData.append("file", file);
    }
    const user: any = getItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
    if (isLoading) useToggleLoading()(true);
    return axios({
      method: "post",
      url: `${DOMAIN_ADMIN}${url}`,
      data: formData,
      params: {},
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${user.access_token}`,
      },
    })
      .then((res) => {
        useToggleLoading()(false);
        return res.data;
      })
      .catch((error) => {
        handleErrorByToast(error);
        return null;
      });
  },
};

export interface PromiseState<T = unknown> extends AxiosResponse<T> {
  totalItem: number;
}

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const user: any = getItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
    if (!config.headers) config.headers = {};
    if (user) config.headers["Authorization"] = `Bearer ${user.access_token}`;
    return config as InternalAxiosRequestConfig;
  },
  (err) => {
    return handleErrorByToast(err);
  },
);

axiosInstance.interceptors.response.use(
  (config) => {
    useToggleLoading()(false);
    return Promise.resolve(config);
  },
  (err) => {
    const { response } = err;
    if (response && response.status === 401) {
      setTimeout(() => {
        removeItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
        window.location.href = ROUTER_URL.LOGIN;
      }, 2000);
    }
    return handleErrorByToast(err);
  },
);

const handleErrorByToast = (error: any) => {
  const message = error.response?.data?.message
    ? error.response?.data?.message
    : error.message;
  toast.error(message);
  useToggleLoading()(false);
  return null;
};
