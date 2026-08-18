import axios from "axios";

import { setupInterceptors } from "./interceptors";

const API_URL =
  "http://192.168.0.103:5000";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

setupInterceptors(apiClient);