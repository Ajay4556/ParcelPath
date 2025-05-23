import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
