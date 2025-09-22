import axios from "axios";

// إنشاء instance من axios مع إعدادات أساسية
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || "http://localhost:8080", // استخدم الرابط من المتغيرات
});

export default apiClient;
