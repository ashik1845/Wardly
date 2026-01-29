import axios from "axios";

export const api = axios.create({
  baseURL: "https://wardly.onrender.com/api",
});
