import axiosInstance from "../axios";

export function GetDepartments() {
  return axiosInstance
    .get("/api/CV/CVGeneralSelection/Departments")
    .then((response) => {
        console.log("res =>",response.data);
        
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
}

export function GetDepartment(id) {}
export function AddDepartment(data) {
  return axiosInstance
    .post(`/api/hr/coding/hrlkpdepartments`, { ...data }, {})
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
}
export function GetGenders() {
  return axiosInstance
    .get("/api/CV/CVGeneralSelection/Gender")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching Genders:", error);
      throw error;
    });
}
export function UpdateDepartment(id, data) {
  //console.log(data);
  return axiosInstance
    .patch(`/api/hr/coding/hrlkpdepartments/${id}`, data)
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
}
export function StarDepartment(id, data) {
  //console.log(data);
  return axiosInstance
    .post(`/api/HR/Coding/HrLkpDepartments/Star/${id}`, { ...data }, {})
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
}
export function DeleteDepartment(id, data) {
  //console.log({ ...data });
  return axiosInstance
    .delete(`/api/HR/Coding/HrLkpDepartments/${id}`, {
      data: { ...data },
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
}

export function GetJobs() {
  return axiosInstance
    .get("/api/CV/CVGeneralSelection/Jops")
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
}

export function GetLocations() {
  return axiosInstance
    .get("/api/hr/coding/hrlkppersonallocations")
    .then((response) => {
      //console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
}

export function GetCountries() {
  return axiosInstance
    .get("/api/CV/CVGeneralSelection/CuntryCityAriaList")
    .then((response) => {
      //console.log(response);

      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
      throw error;
    });
}

export function GetHowDoYouKnow() {
  return axiosInstance
    .get("/api/CV/CVGeneralSelection/HowNowAboutUs")
    .then((response) => {
      //console.log(response);

      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching howDoYouKnow:", error);
      throw error;
    });
}