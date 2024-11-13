import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiRequestModel } from "../../models/api/interceptor/ApiRequestModel";
// import { toast } from "react-toastify";
import { message } from "antd";
import { clearLocalStorage, getItemInLocalStorage } from "../../utils/storage";
import { DOMAIN_ADMIN, LOCAL_STORAGE } from "../../const/domain";
import { ROUTER_URL } from "../../const/router.path";
import { store } from "../../app/redux/store";
import { toggleLoading } from "../../app/redux/loadingSlice";
import { HTTP_STATUS } from "../../app/enums";
import { HttpException } from "../../app/exceptions";
import { handleUploadFile } from "../../utils/upload"; // Import the handleUploadFile function

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
    if (toggleLoading) setTimeout(() => toggleLoading(isLoading), 2000);
    return axiosInstance
      .get<T, PromiseState<T>>(`${url}`, {
        params: payload,
        headers: headers || {}
      })
      .finally(() => {
        if (toggleLoading) toggleLoading(false);
      });
  },
  post<T = any>({ url, isLoading = true, payload, headers, toggleLoading }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
    if (toggleLoading) setTimeout(() => toggleLoading(isLoading), 2000);
    return axiosInstance
      .post<T, PromiseState<T>>(`${url}`, payload, {
        headers: headers || {}
      })
      .finally(() => {
        if (toggleLoading) toggleLoading(false);
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
    if (toggleLoading) setTimeout(() => toggleLoading(isLoading), 2000);
    return axiosInstance
      .put<T, PromiseState<T>>(`${url}`, payload, {
        headers: headers || {}
      })
      .finally(() => {
        if (toggleLoading) toggleLoading(false);
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
    if (toggleLoading) setTimeout(() => toggleLoading(isLoading), 2000);
    return axiosInstance
      .delete<T, PromiseState<T>>(`${url}`, {
        params: payload,
        headers: headers || {}
      })
      .finally(() => {
        if (toggleLoading) toggleLoading(false);
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
    if (toggleLoading) setTimeout(() => toggleLoading(isLoading), 2000);
    return axiosInstance
      .get<T, PromiseState<T>>(`${url}`, {
        params: payload,
        headers: headers || {}
      })
      .finally(() => {
        if (toggleLoading) toggleLoading(false);
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
    if (isLoading) setTimeout(() => store.dispatch(toggleLoading(true)), 2000);
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
  },
  uploadFile: async (file: File, type: "video" | "image", isLoading: boolean = true) => {
    if (isLoading) setTimeout(() => store.dispatch(toggleLoading(true)), 2000);

    try {
      const url = await handleUploadFile(file, type);
      if (url) {
        message.success(`${type} uploaded successfully`);
        return url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error(error instanceof Error ? error.message : "Upload failed");
      return null;
    } finally {
      if (isLoading) store.dispatch(toggleLoading(false));
    }
  }
};

export interface PromiseState<T = unknown> extends AxiosResponse<T> {
  totalItem: number;
}

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");
    if (!config.headers) config.headers = {};
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      config.headers["User-Id"] = parsedUserInfo._id; // debug add user id
    }
    setTimeout(() => store.dispatch(toggleLoading(true)), 2000); // Show loading with delay
    return config as InternalAxiosRequestConfig;
  },
  (err) => {
    setTimeout(() => store.dispatch(toggleLoading(false)), 2000); // Hide loading with delay
    return handleErrorByToast(err);
  }
);

axiosInstance.interceptors.response.use(
  (config) => {
    setTimeout(() => store.dispatch(toggleLoading(false)), 2000); // Hide loading with delay
    return Promise.resolve(config);
  },
  (err) => {
    setTimeout(() => store.dispatch(toggleLoading(false)), 2000); // Hide loading on error with delay
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
          // setTimeout(() => {
          //   window.location.href = ROUTER_URL.LOGIN;
          // }, 2000);
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
