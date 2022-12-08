const { default: axiosClient } = require("./axiosClient");
const EducationProgramAPI = {
  getPage({ page = 1, size = 10, facultyCode, name, schoolYearCode, status }) {
    return axiosClient.get("v1/education-program/page", {
      params: {
        page,
        size,
        facultyCode,
        name,
        schoolYearCode,
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
  update(params, formData) {
    return axiosClient.put("v1/education-program", formData, {
      params,
    });
  },
  create(params, formData) {
    return axiosClient.post("v1/education-program", formData, {
      params: params,
    });
  },
  hidden(ids) {
    return axiosClient.put("v1/education-program/toggle-status?ids=" + ids);
  },
  getSubject({ code }) {
    return axiosClient.get("v1/education-program/subjects?code=" + code);
  },
};

export default EducationProgramAPI;