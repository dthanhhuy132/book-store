import axios from 'axios';
import Cookies from 'js-cookie';
import {getTokenSSRAndCSS} from '../helper';
const baseURL = 'http://localhost:5000/api';

const api = {
   call() {
      return axios.create({
         baseURL,
         headers: {
            // 'Content-type': 'application/json',
            // Authorization: "Bearer " + localStorage.getItem("spotifyAuthToken"),
         },
      });
   },

   callWithToken(token) {
      return axios.create({
         baseURL,
         headers: {
            // 'Content-type': 'application/json',
            Authorization: 'Bearer ' + token,
         },
      });
   },
};

axios.interceptors.response.use(
   function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
   },
   function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
   }
);

export default api;
