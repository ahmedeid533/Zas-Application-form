import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;

// import { createBrowserHistory } from "history";
const navigate = (await import("react-router-dom")).useNavigate;

// const SERVER_URL = baseURL;
const SERVER_URL = baseURL;

// const history = createBrowserHistory();

const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    withCredentials: true,
  },
});
export const uploadAxiosInstance = axios.create({
  baseURL: `${SERVER_URL}`,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "*/*",
    withCredentials: true,
  },
});
uploadAxiosInstance.interceptors.request.use(
  (config) => {
    let user = localStorage.getItem("user") ? localStorage.getItem("user") : "";
    if (user) {
      user = JSON.parse(user);
      // token = `B`
    }
    config.headers = {
      Accept: "*/*",
      withCredentials: true,
      Authorization: `Bearer ${user.encodedPayload}`,
    };
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.request.use(
  (config) => {
    let user = localStorage.getItem("user") ? localStorage.getItem("user") : "";
    if (user) {
      user = JSON.parse(user);
      // token = `B`
    }
    console.log("user",user);
    

    config.headers = {
      Accept: "*/*",
      withCredentials: true,
      Authorization: `Bearer ${user.encodedPayload}`,
      ContentType: "application/json",
    };

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let refresh = 1;
    console.log(error);
    if (error && error.response?.status === 401) {
      localStorage.removeItem("user");
      navigate("/");
      // history.replace({ pathname: "/login" });
      // window.location.reload();
    } else if (error && error.response?.status === 424) {
      try {
        if (refresh === 1) {
          refresh = 0;
          console.log("here");
          // const refreshToken = await updateAccessToken();
          // console.log(refreshToken);
        }
      } catch (refreshError) {
        localStorage.removeItem("user");
        navigate("/");
        // history.replace({ pathname: "/login" });
        // window.location.reload();
        return Promise.reject(refreshError);
      }
    } else if (error.response && error.response?.status === 500) {
      return Promise.reject(error.response);
    } else return Promise.reject(error);
  }
);

export default axiosInstance;
