const { default: axiosClient } = require("./axiosClient");
const FacultyAPI = {
  getALLFaculty(status=true) {
    const url = `v1/faculties/all?status=${status}`;
    return axiosClient.get(url);
  },
  getPageFaculty({ page = 1, size = 10 }) {
    return axiosClient.get("v1/faculties/page", {
      params: {
        page,
        size,
      },
    });
  },
  getOneFaculty({ code }) {
    return axiosClient.get("v1/faculties", {
      params: {
        code: code,
      },
    });
  },
  updateFaculty(body) {
    return axiosClient.put("v1/faculties", body);
  },
  createFaculty(body) {
    return axiosClient.post("v1/faculties", body);
  },
  hiddenFaculty(ids) {
    return axiosClient.put("v1/faculties/toggle-status?ids="+ids);
  },
};

export default FacultyAPI;
