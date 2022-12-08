const { default: axiosClient } = require("./axiosClient");
const NotificationGroupAPI = {
  getNotificationGroupAll(status) {
    const url = `v1/notification-groups/all?status=${status}`;
    return axiosClient.get(url);
  },
};

export default NotificationGroupAPI;
