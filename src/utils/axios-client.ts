import axios from 'axios';

const axiosUsersClient = axios.create({
  baseURL: import.meta.env.VITE_USERS_MICROSERVICE_BASE_URL,
  timeout: 30000,
  withCredentials: true
});

const axiosRehomersClient = axios.create({
  baseURL: import.meta.env.VITE_ANIMALS_MICROSERVICE_REHOMER_BASE_URL,
  timeout: 30000,
  withCredentials: true
});

const axiosAnimalsClient = axios.create({
  baseURL: import.meta.env.VITE_ANIMALS_MICROSERVICE_BASE_URL,
  timeout: 30000,
  withCredentials: true
});

export { axiosUsersClient, axiosRehomersClient, axiosAnimalsClient };
