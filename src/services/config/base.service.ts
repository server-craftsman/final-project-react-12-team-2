import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiRequestModel } from "../../models/api/interceptor/ApiRequestModel";
import { toast } from "react-toastify";
import { getItemInLocalStorage, removeItemInLocalStorage } from "../../utils/storage";
import { DOMAIN_ADMIN, LOCAL_STORAGE } from "../../const/domain";
import { ROUTER_URL } from "../../const/router.path";
import { store } from "../../app/store";
import { toggleLoading } from "../../app/loadingSlice";

export const axiosInstance = axios.create({
  baseURL: DOMAIN_ADMIN,
  headers: {
    "content-type": "application/json; charset=UTF-8"
  },
  timeout: 300000,
  timeoutErrorMessage: `Connection is timeout exceeded`
});

// export const getState = (store: any) => {REgister
//   return store.getState();
// };

export const BaseService = {
  get<T = any>({
    url,
    isLoading = true,
    payload,
    headers,
    toggleLoading
  }: Partial<ApiRequestModel> & {
    toggleLoading?: (isLoading: boolean) => void;
  }): Promise<PromiseState<T>> {
    if (toggleLoading) toggleLoading(isLoading);
    return axiosInstance.get<T, PromiseState<T>>(`${url}`, {
      params: payload,
      headers: headers || {}
    });
  },
  post<T = any>({ url, isLoading = true, payload, headers, toggleLoading }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
    if (toggleLoading) toggleLoading(isLoading);
    // if (toggleLoadingAdmin) toggleLoadingAdmin(isLoading);
    // console.log("payload: ", payload);
    return axiosInstance.post<T, PromiseState<T>>(`${url}`, payload, {
      headers: headers || {}
    });
  },
  put<T = any>({
    url,
    isLoading = true,
    payload,
    headers,
    toggleLoading
  }: Partial<ApiRequestModel> & {
    toggleLoading?: (isLoading: boolean) => void;
  }): Promise<PromiseState<T>> {
    if (toggleLoading) toggleLoading(isLoading);
    return axiosInstance.put(`${url}`, payload, {
      headers: headers || {}
    });
  },
  remove<T = any>({
    url,
    isLoading = true,
    payload,
    headers,
    toggleLoading
  }: Partial<ApiRequestModel> & {
    toggleLoading?: (isLoading: boolean) => void;
  }): Promise<PromiseState<T>> {
    if (toggleLoading) toggleLoading(isLoading);
    return axiosInstance.delete(`${url}`, {
      params: payload,
      headers: headers || {}
    });
  },
  getById<T = any>({
    url,
    isLoading = true,
    payload,
    headers,
    toggleLoading
  }: Partial<ApiRequestModel> & {
    toggleLoading?: (isLoading: boolean) => void;
  }): Promise<PromiseState<T>> {
    if (toggleLoading) toggleLoading(isLoading);
    return axiosInstance.get<T, PromiseState<T>>(`${url}`, {
      params: payload,
      headers: headers || {}
    });
  },
  uploadMedia(url: string, file?: any, isMultiple: boolean = false, isLoading: boolean = true) {
    const formData = new FormData();
    if (isMultiple) {
      for (let i = 0; i < file.length; i++) {
        formData.append("files[]", file[i]);
      }
    } else {
      formData.append("file", file);
    }
    const user: any = getItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
    // if (isLoading) useToggleLoading()(true);
    if (isLoading) store.dispatch(toggleLoading(true));
    return axios({
      method: "post",
      url: `${DOMAIN_ADMIN}${url}`,
      data: formData,
      params: {},
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${user.access_token}`
      }
    })
      .then((res) => {
        // useToggleLoading()(false);
        return res.data;
      })
      .catch((error) => {
        handleErrorByToast(error);
        return null;
      });
  }
};

export interface PromiseState<T = unknown> extends AxiosResponse<T> {
  totalItem: number;
}

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const user: any = getItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
    if (!config.headers) config.headers = {};
    if (user) config.headers["Authorization"] = `Bearer ${user.access_token}`;
    store.dispatch(toggleLoading(true)); // Show loading
    return config as InternalAxiosRequestConfig;
  },
  (err) => {
    store.dispatch(toggleLoading(false)); // Hide loading on error
    return handleErrorByToast(err);
  }
);

axiosInstance.interceptors.response.use(
  (config) => {
    store.dispatch(toggleLoading(false)); // Hide loading
    return Promise.resolve(config);
  },
  (err) => {
    store.dispatch(toggleLoading(false)); // Hide loading on error
    const { response } = err;
    if (response && response.status === 401) {
      setTimeout(() => {
        removeItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
        window.location.href = ROUTER_URL.LOGIN;
      }, 10000);
    }
    return handleErrorByToast(err);
  }
);

const handleErrorByToast = (error: any) => {
  const message = error.response?.data?.message || error.message;
  toast.error(message);
  return Promise.reject(error);
};
