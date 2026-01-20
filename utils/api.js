import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_BASE,
  params: {
    key: process.env.API_KEY,
  },
});

export default api;
