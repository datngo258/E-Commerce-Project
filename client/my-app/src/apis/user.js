import axios from "../axios";

export const apiRegister = (data) =>
  axios({
    url: "/user/register",
    method: "post",
    withCredentials: true,
    data,
  });
export const apiLogin = (data) =>
  axios({
    url: "/user/login",
    method: "post",
    data,
    withCredentials: true,
  });
export const apiForgotPassword = (data) =>
  axios({
    url: "/user/forgotpassword",
    method: "post",
    data,
  });
export const apiResetPassword = ({ password, token }) =>
  axios({
    url: `/user/resetpassword/${token}`,
    method: "put",
    data: { password },
  });
