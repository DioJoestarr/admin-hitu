const { default: axiosClient } = require("./axiosClient");
const TeacherAPI = {
  postCreateTeacher(obj) {
    const url = "/api/v1/teachers";
    return axiosClient.post(url, obj);
  },
  putUpdateTeacher(obj) {
    const url = "/api/v1/teachers";
    return axiosClient.put(url);
  },



  async getTeacherListAPI(page,size) {
    const url = `v1/teachers/page?page=${page}&size=${size}`;
    return await axiosClient.get(url);
  },
  async getSingleTeacher(userId) {
    const url = `/v1/teachers?userId=${userId}`;
    return await axiosClient.get(url);
  },

  async deleteSingleUser(ids) {
    const url = `v1/teachers/toggle-status?ids=${ids}`;
    return await axiosClient.put(url);
  }

};

export default TeacherAPI;
