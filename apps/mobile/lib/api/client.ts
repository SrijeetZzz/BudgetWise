import axios from "axios";

import { setupInterceptors } from "./interceptors";

const API_URL =
  "https://budgetwise-fa4r.onrender.com";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

setupInterceptors(apiClient);
