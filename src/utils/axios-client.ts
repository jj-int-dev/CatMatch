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

const axiosGeoapifyClient = axios.create({
  baseURL: import.meta.env.VITE_GEOAPIFY_BASE_API_URL,
  timeout: 30000,
  params: {
    apiKey: import.meta.env.VITE_GEOAPIFY_API_KEY
  }
});

export {
  axiosUsersClient,
  axiosRehomersClient,
  axiosAnimalsClient,
  axiosGeoapifyClient
};
