import {createAsyncThunk} from '@reduxjs/toolkit';
import authApi from '../../service/authApi';

export const loginAsyncAction: any = createAsyncThunk('auth/login', async ({loginData}: any) => {
   try {
      const response = await authApi.login(loginData);
      console.log('response cho nay la gi', response);

      return {
         ok: true,
         user: response.data.data,
      };
   } catch (error) {
      console.log('errror tra ve la gi', error);
      return {ok: false, message: error.response.data.message};
   }
});

export const registerAsyncAction: any = createAsyncThunk(
   'auth/regiter',
   async (regiterData: any) => {
      try {
         const response = await authApi.register(regiterData);

         return {
            ok: true,
            data: response.data.data,
         };
      } catch (error) {
         return {ok: false, message: error.response.data.message};
      }
   }
);

export const logOutAsyncAction: any = createAsyncThunk('auth/regiter', async (regiterData: any) => {
   try {
      const response = await authApi.logout();
      return {
         ok: true,
      };
   } catch (error) {
      return {ok: false, message: error.response.data.message};
   }
});

export const getAllUserAsync: any = createAsyncThunk(
   'auth/getAllUserAsync',
   async ({accessToken}: any) => {
      try {
         const response = await authApi.getAllUser(accessToken);
         return {
            ok: true,
            data: response.data.data,
         };
      } catch (error) {
         return {ok: false, message: error.response.data.message};
      }
   }
);
