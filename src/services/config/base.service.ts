import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiRequestModel } from "../../models/api/interceptor/ApiRequestModel";
import { message } from "antd";
import { clearLocalStorage } from "../../utils/storage";
import { DOMAIN_ADMIN } from "../../const/domain";
import { ROUTER_URL } from "../../const/router.path";
import { HTTP_STATUS } from "../../app/enums";
import { HttpException } from "../../app/exceptions";
import { handleUploadFile, deleteFileFromCloudinary } from "../../utils/upload";
import { useLoading } from "../../contexts/LoadingContext";

export const axiosInstance = axios.create({
  baseURL: DOMAIN_ADMIN,
  headers: {
    "content-type": "application/json; charset=UTF-8"
  },
  timeout: 300000,
  timeoutErrorMessage: `Connection is timeout exceeded`
});

// Utility function to manage loading state
const manageLoading = (isLoading: boolean) => {
  const { setIsLoading } = useLoading();
  setIsLoading(isLoading);
};

export const BaseService = {
  get<T = any>({ url, isLoading = true, payload, headers }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
    manageLoading(isLoading);
    return axiosInstance
      .get<T, PromiseState<T>>(`${url}`, {
        params: payload,
        headers: headers || {}
      })
      .finally(() => {
        manageLoading(false);
      });
  },
  post<T = any>({ url, isLoading = true, payload, headers }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
    manageLoading(isLoading);
    return axiosInstance
      .post<T, PromiseState<T>>(`${url}`, payload, {
        headers: headers || {}
      })
      .finally(() => {
        manageLoading(false);
      });
  },
  put<T = any>({ url, isLoading = true, payload, headers }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
    manageLoading(isLoading);
    return axiosInstance
      .put<T, PromiseState<T>>(`${url}`, payload, {
        headers: headers || {}
      })
      .finally(() => {
        manageLoading(false);
      });
  },
  remove<T = any>({ url, isLoading = true, payload, headers }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
    manageLoading(isLoading);
    return axiosInstance
      .delete<T, PromiseState<T>>(`${url}`, {
        params: payload,
        headers: headers || {}
      })
      .finally(() => {
        manageLoading(false);
      });
  },
  getById<T = any>({ url, isLoading = true, payload, headers }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
    manageLoading(isLoading);
    return axiosInstance
      .get<T, PromiseState<T>>(`${url}`, {
        params: payload,
        headers: headers || {}
      })
      .finally(() => {
        manageLoading(false);
      });
  },
  uploadFile: async (file: File, type: "video" | "image", isLoading: boolean = true) => {
    manageLoading(isLoading);
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
      manageLoading(false);
    }
  },
  deleteFile: async (publicId: string, type: "video" | "image", isLoading: boolean = true) => {
    manageLoading(isLoading);
    try {
      const success = await deleteFileFromCloudinary(publicId, type);
      if (success) {
        message.success(`${type} deleted successfully`);
        return true;
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      message.error(error instanceof Error ? error.message : "Delete failed");
      return false;
    } finally {
      manageLoading(false);
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
    return config as InternalAxiosRequestConfig;
  },
  (err) => {
    return handleErrorByToast(err);
  }
);

axiosInstance.interceptors.response.use(
  (config) => {
    return Promise.resolve(config);
  },
  (err) => {
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
