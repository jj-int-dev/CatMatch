import axios from 'axios';

const axiosUsersClient = axios.create({
  baseURL: import.meta.env.VITE_USERS_MICROSERVICE_BASE_URL,
  timeout: 30000,
  withCredentials: true
});

export { axiosUsersClient };
