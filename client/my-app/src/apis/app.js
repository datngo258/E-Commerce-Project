import axios from "../axios";

export const apiGetCategories = () =>
  axios({
    url: "/producCategory/",
    method: "get",
  });

