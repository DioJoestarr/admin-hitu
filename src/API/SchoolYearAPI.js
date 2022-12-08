const { default: axiosClient } = require("./axiosClient");
const SchoolYearAPI = {
  getAll({ status = true }) {
    return axiosClient.get("v1/school-years/all", {
      params: {
        status,
      },
    });
  },
  getOne({ code }) {
    return axiosClient.get("v1/education-program", {
      params: {
        code: code,
      },
    });
  },
  update(body) {
    return axiosClient.put("v1/education-program", body);
  },

  create(body) {
    return axiosClient.post("v1/education-program", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  hidden(ids) {
    return axiosClient.put("v1/education-program/toggle-status?ids=" + ids);
  },
  getSubject({ code }) {
    return axiosClient.get("v1/education-program/subjects?code=" + code);
  },
};

export default SchoolYearAPI;