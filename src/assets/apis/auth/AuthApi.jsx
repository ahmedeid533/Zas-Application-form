import axiosInstance from "../axios";

export function Register(data) {
  return axiosInstance
    .post("/api/Authonticate/RegisterMobil", { ...data }, {})
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
}

export function LoginAuth(data) {
  return axiosInstance
    .post("/api/Authonticate/login", { ...data }, {})
    .then(async (response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
}

export function updateAccessToken() {
  return axiosInstance
    .post("/api/Authonticate/LoginRefresh")
    .then((res) => {
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching newToken:", error);
      throw error;
    });
}
