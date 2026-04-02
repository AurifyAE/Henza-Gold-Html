import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Secret-Key': import.meta.env.VITE_APP_API_KEY
  },
  withCredentials: true,
});

export default axiosInstance