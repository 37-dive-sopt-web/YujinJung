import axios from "axios";
import { appConfig } from "../config/app-config";

export const apiClient = axios.create({
  baseURL: appConfig.api.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
