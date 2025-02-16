import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5200",
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/auth";
        }

        if (error.response.status === 403) {
            const response = await axiosInstance.get("/auth/refresh")
            localStorage.setItem("token", response.data.accessToken)
            return axiosInstance.request(error.config)
        }

        return Promise.reject(error);
    }
);