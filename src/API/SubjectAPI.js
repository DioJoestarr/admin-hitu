const { default: axiosClient } = require("./axiosClient");
const SubjectAPI = {
  updateFaculty(body) {
    return axiosClient.put("v1/subjects", body);
  },
  createFaculty(body) {
    return axiosClient.post("v1/subjects", body);
  },
  hiddenFaculty(ids) {
    return axiosClient.put("v1/subjects/toggle-status?ids=" + ids);
  },
};

export default SubjectAPI;