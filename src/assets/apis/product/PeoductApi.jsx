import axiosInstance from "../axios";

export function GetAllProducts() {
  return axiosInstance
    .get("/api/OnlineOrders/GeneralSelection/GrandGroupList")
    .then(async (response) => {
      //console.log(response);
      return response?.data;
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      
    });

}
