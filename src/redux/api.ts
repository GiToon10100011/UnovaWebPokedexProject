import axios from "axios";

export const pokeAPI = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
  headers: {
    "Content-Type": "application/json",
  },
});

pokeAPI.interceptors.request.use(
  function (config) {
    // console.log(config);
    return config;
  },
  function (error) {
    console.error(error);
    return Promise.reject(error);
  }
);

pokeAPI.interceptors.response.use(
  function (response) {
    // console.log(response);
    return response;
  },
  function (error) {
    console.error(error);
    return Promise.reject(error);
  }
);
