import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import configs from "@/constants/configs";
import authenticateStore from "@/store/authenticateStore";

const REFRESH_TOKEN_URL = `${configs.API_URL}auth/refresh-token`;
const { accessToken, refreshToken } = authenticateStore.getState();

// Set up the base URL for your API
const request = axios.create({
  baseURL: configs.API_URL,
  timeout: 10000,
  headers: { Accept: "*/*" },
});

// Function to get a new access token using the refresh token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(REFRESH_TOKEN_URL, {
      refreshToken,
    });
    const { accessToken: newAccessToken } = response.data;

    // Store the new access token
    await AsyncStorage.setItem("accessToken", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);
    return null;
  }
};

// Request interceptor to add the access token to headers
request.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired tokens and retry requests
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newRefreshToken = await refreshAccessToken();
      if (newRefreshToken) {
        originalRequest.headers.Authorization = `Bearer ${newRefreshToken}`;
        return request(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default request;
