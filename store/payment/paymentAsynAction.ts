import {createAsyncThunk} from '@reduxjs/toolkit';
import paymentApi from '../../service/paymentApi';

export const getAllPaymentAsync: any = createAsyncThunk(
   'payment/getAllPaymentAsync',
   async ({accessToken}: any) => {
      try {
         const res = await paymentApi.getAllPayment(accessToken);
         console.log('res trong getALl Payment', res);
         return {
            ok: true,
            data: res?.data?.data,
         };
      } catch (error) {
         return {
            ok: false,
         };
      }
   }
);

export const createPaymentAsyns: any = createAsyncThunk(
   'payment/createNewPaymentAsync',
   async ({accessToken, paymentData}: any) => {
      console.log('trong async function: ', accessToken, paymentData);
      try {
         const res = await paymentApi.createPayment(accessToken, paymentData);

         return {
            ok: true,
            // data: res.data.res,
         };
      } catch (error) {
         return {
            ok: false,
            messsage: error.response.data.message,
         };
      }
   }
);

export const getPaymentByUserId: any = createAsyncThunk(
   'payment/getPaymentByUserId',
   async ({accessToken, userId}: any) => {
      try {
         const res = await paymentApi.getPaymentByUser(accessToken, userId);

         return {
            ok: true,
            // data: res.data.res,
         };
      } catch (error) {
         console.log('error cho nay la gi', error);
         return {
            ok: false,
            messsage: error.response.data.message,
         };
      }
   }
);

export const deletePaymentAsync: any = createAsyncThunk(
   'payment/deletePaymentAsync',
   async ({accessToken, paymentId}: any) => {
      try {
         const res = await paymentApi.deletePayment(accessToken, paymentId);

         console.log('res cho nay la gi', res);
         return {
            ok: true,
            // data: res.data.res,
         };
      } catch (error) {
         return {
            ok: false,
            messsage: error.response.data.message,
         };
      }
   }
);

export const updatePaymentByIdAsync: any = createAsyncThunk(
   'payment/updatePaymentAsync',
   async ({accessToken, paymentId, paymentUpdateData}: any) => {
      try {
         const res = await paymentApi.updatePaymentById(accessToken, paymentId, paymentUpdateData);

         console.log('res cho nay la gi', res);
         return {
            ok: true,
            // data: res.data.res,
         };
      } catch (error) {
         return {
            ok: false,
            messsage: error.response.data.message,
         };
      }
   }
);
