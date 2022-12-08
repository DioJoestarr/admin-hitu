const { default: axiosClient } = require("./axiosClient");

const NewsAPI = {
  //Page NEWS 
    getPageNewsAPI(code) {
      const url = `v1/news/${code}`;
      return axiosClient.get(url);
    },

  //Page List NEWS
    getListNewsAPI(page,size) {
      const url = `v1/news/page?page=${page}&size=${size}`;
      return axiosClient.get(url);
    },


};

export default NewsAPI;
