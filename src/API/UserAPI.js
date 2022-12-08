const { default: axiosClient } = require("./axiosClient");
const UserAPI = {
  postLoginUser(obj) {
    const url = "auth/login";

    console.log(3);
    return axiosClient.post(url,obj);

  },
};
export default UserAPI;
