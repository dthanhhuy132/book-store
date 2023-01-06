import axios from 'axios';
import Cookies from 'js-cookie';
import {getTokenSSRAndCSS} from '../helper';
const baseURL = 'http://localhost:5000/api';
// const baseURL = 'https://buk365-be-production.up.railway.app/api';

const api = {
   call() {
      return axios.create({
         baseURL,
         withCredentials: false,
         headers: {
            // 'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
         },
      });
   },

   callWithToken(token) {
      return axios.create({
         baseURL,
         headers: {
            // 'Content-type': 'application/json',
            Authorization: 'Bearer ' + token,
            'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
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
