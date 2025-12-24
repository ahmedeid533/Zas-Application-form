import axiosInstance from "../axios";

export function GetCountriesCodes() {
  return axiosInstance
    .get("/api/CuntryCityAriaList/Cuntry")
    .then((response) => {
        console.log("res =>",response.data);
        
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching countries:", error);
      throw error;
    });
}