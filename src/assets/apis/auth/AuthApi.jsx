import axiosInstance from "../axios";

export function register(data) {
  return axiosInstance
    .post("/api/Authonticate/RegisterSkyCulinaire",{...data},{})
    .then((response) => {
        console.log("res =>",response.data);
        
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error to register:", error);
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
      console.error("Error to login:", error);
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
