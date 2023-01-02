import api from './api';

const authApi = {
   login: (loginData) => {
      return api.call().post('/auth/login', loginData);
   },
   register: (registerData) => {
      return api.call().post('/auth/register', registerData);
   },

   logout: () => {
      return api.call().delete('/auth/logout');
   },

   getAllUser: (token) => {
      return api.callWithToken(token).get('user/admin/getAllUser');
   },
};

export default authApi;
