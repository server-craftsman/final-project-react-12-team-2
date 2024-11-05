import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiRequestModel } from "../../models/api/interceptor/ApiRequestModel";
// import { toast } from "react-toastify";
import { message } from "antd";
import { clearLocalStorage, getItemInLocalStorage } from "../../utils/storage";
import { DOMAIN_ADMIN, LOCAL_STORAGE } from "../../const/domain";
import { ROUTER_URL } from "../../const/router.path";
import { store } from "../../app/store";
import { toggleLoading } from "../../app/loadingSlice";
import { HTTP_STATUS } from "../../app/enums";
import { HttpException } from "../../app/exceptions";

export const axiosInstance = axios.create({
  baseURL: DOMAIN_ADMIN,
  headers: {
    "content-type": "application/json; charset=UTF-8"
  },
  timeout: 300000,
  timeoutErrorMessage: `Connection is timeout exceeded`
});

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
    if (toggleLoading) setTimeout(() => toggleLoading(isLoading), 500);
    return axiosInstance.get<T, PromiseState<T>>(`${url}`, {
      params: payload,
      headers: headers || {}
    });
  },
  post<T = any>({ url, isLoading = true, payload, headers, toggleLoading }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
    if (toggleLoading) setTimeout(() => toggleLoading(isLoading), 500);
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
    if (toggleLoading) setTimeout(() => toggleLoading(isLoading), 500);
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
    if (toggleLoading) setTimeout(() => toggleLoading(isLoading), 500);
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
    if (toggleLoading) setTimeout(() => toggleLoading(isLoading), 500);
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
    if (isLoading) setTimeout(() => store.dispatch(toggleLoading(true)), 500);
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
    const token = localStorage.getItem("token");
    if (!config.headers) config.headers = {};
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    store.dispatch(toggleLoading(true)); // Show loading
    return config as InternalAxiosRequestConfig;
  },
  (err) => {
    store.dispatch(toggleLoading(false));
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
    if (response) {
      switch (response.status) {
        case HTTP_STATUS.UNAUTHORIZED:
          setTimeout(() => {
            clearLocalStorage();
            window.location.href = ROUTER_URL.LOGIN;
          }, 10000);
          break;
        case HTTP_STATUS.FORBIDDEN:
          message.error("Access denied. You do not have permission to perform this action.");
          setTimeout(() => {
            clearLocalStorage();
            window.location.href = ROUTER_URL.LOGIN;
          }, 2000);
          break;
        case HTTP_STATUS.NOT_FOUND:
          message.error("Requested resource not found.");
          setTimeout(() => {
            window.location.href = ROUTER_URL.LOGIN;
          }, 2000);
          break;
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          message.error("Internal server error. Please try again later.");
          break;
        default:
          message.error(response.data?.message || "An error occurred. Please try again.");
      }
    } else {
      message.error(err.message || "An error occurred. Please try again.");
    }
    return Promise.reject(new HttpException(err.message, response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
);

const handleErrorByToast = (error: any) => {
  const message = error.response?.data?.message || error.message;
  message.error(message);
  return Promise.reject(error);
};
